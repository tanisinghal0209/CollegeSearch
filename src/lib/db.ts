import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';
import { ALL_COLLEGES, INITIAL_REVIEWS, College, Review } from './mockData';

// Fallback JSON DB Configuration
const FALLBACK_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'db-fallback.json');

interface FallbackSchema {
  colleges: College[];
  users: any[];
  savedColleges: { id?: string; userId: string; collegeId: string }[];
}

function initFallbackDb(): FallbackSchema {
  if (fs.existsSync(FALLBACK_FILE_PATH)) {
    try {
      const data = fs.readFileSync(FALLBACK_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading fallback DB, recreating...", e);
    }
  }

  const colleges: College[] = ALL_COLLEGES.map(c => {
    const collegeReviews = INITIAL_REVIEWS
      .filter(r => r.collegeId === c.id)
      .map((r, idx) => ({
        ...r,
        id: `rev_${c.id}_${idx}`,
        createdAt: new Date(Date.now() - idx * 86400000).toISOString()
      }));

    const avgRating = collegeReviews.length > 0
      ? collegeReviews.reduce((sum, r) => sum + r.rating, 0) / collegeReviews.length
      : c.rating || 0;

    return {
      ...c,
      reviews: collegeReviews,
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: collegeReviews.length || c.reviewCount || 0
    };
  });

  const schema: FallbackSchema = {
    colleges,
    users: [],
    savedColleges: []
  };

  saveFallbackDb(schema);
  return schema;
}

function saveFallbackDb(schema: FallbackSchema) {
  try {
    fs.mkdirSync(path.dirname(FALLBACK_FILE_PATH), { recursive: true });
    fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(schema, null, 2), 'utf-8');
  } catch (e) {
    console.error("Failed to write to fallback DB:", e);
  }
}

async function canUsePrisma(): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not defined in environment variables. Falling back to JSON DB.");
    return false;
  }
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB Timeout")), 2000)
    );
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeout]);
    return true;
  } catch (e: any) {
    console.error("Prisma connection check failed. Falling back to JSON DB. Error:", e?.message || e);
    return false;
  }
}

export interface CollegeFindManyFilters {
  search?: string;
  state?: string;
  type?: string;
  exam?: string[];
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const db = {
  college: {
    async findMany(filters?: CollegeFindManyFilters): Promise<{ colleges: College[]; total: number; page: number; totalPages: number }> {
      const page = filters?.page || 1;
      const limit = filters?.limit || 12;

      const useDb = await canUsePrisma();

      if (useDb) {
        try {
          const whereClause: any = {};

          if (filters?.search) {
            whereClause.OR = [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { city: { contains: filters.search, mode: 'insensitive' } },
              { state: { contains: filters.search, mode: 'insensitive' } },
              { courses: { some: { name: { contains: filters.search, mode: 'insensitive' } } } }
            ];
          }
          if (filters?.state) {
            whereClause.state = filters.state;
          }
          if (filters?.type) {
            whereClause.type = filters.type;
          }
          if (filters?.minRating) {
            whereClause.rating = { gte: filters.minRating };
          }

          // Exam filter via predictorData relation
          if (filters?.exam && filters.exam.length > 0) {
            const examMap: Record<string, string> = {
              'JEE Main': 'JEE_MAIN',
              'JEE Advanced': 'JEE_ADVANCED',
              'CAT': 'CAT',
              'NEET': 'NEET',
              'State CET': 'STATE_CET',
              'BITSAT': 'BITSAT',
              'CUET': 'CUET'
            };
            const mappedExams = filters.exam.map(e => examMap[e] || e);
            whereClause.predictorData = { some: { exam: { in: mappedExams } } };
          }

          const orderBy: any = {};
          switch (filters?.sortBy) {
            case 'rating': orderBy.rating = 'desc'; break;
            case 'fees-asc': orderBy.ranking = 'asc'; break;
            case 'fees-desc': orderBy.ranking = 'desc'; break;
            default: orderBy.ranking = 'asc'; break;
          }

          const [total, colleges] = await Promise.all([
            prisma.college.count({ where: whereClause }),
            prisma.college.findMany({
              where: whereClause,
              orderBy,
              skip: (page - 1) * limit,
              take: limit,
              include: {
                reviews: {
                  include: { user: { select: { name: true, image: true } } }
                },
                courses: true,
                predictorData: true
              }
            })
          ]);

          const mapped = colleges.map(col => {
            const fees = col.fees as { min: number; max: number; currency: string };
            const placements = col.placements as { averageSalary: number; highestSalary: number; topRecruiters: string[]; placementRate: number };
            return {
              ...col,
              fees,
              placements,
              reviews: col.reviews.map(r => ({
                id: r.id,
                rating: r.rating,
                title: r.title,
                body: r.body,
                pros: r.pros || undefined,
                cons: r.cons || undefined,
                batch: r.batch || undefined,
                userId: r.userId,
                userName: r.user.name || "Anonymous",
                userImage: r.user.image || undefined,
                collegeId: r.collegeId,
                createdAt: r.createdAt.toISOString()
              }))
            };
          });

          // Post-filter by fees if needed (since fees is JSON)
          let filtered = mapped;
          if (filters?.minFees) {
            filtered = filtered.filter(c => c.fees.max >= (filters.minFees || 0));
          }
          if (filters?.maxFees) {
            filtered = filtered.filter(c => c.fees.min <= (filters.maxFees || Infinity));
          }

          // Post-sort by fees if needed
          if (filters?.sortBy === 'fees-asc') {
            filtered.sort((a, b) => a.fees.min - b.fees.min);
          } else if (filters?.sortBy === 'fees-desc') {
            filtered.sort((a, b) => b.fees.max - a.fees.max);
          }

          return {
            colleges: filtered,
            total,
            page,
            totalPages: Math.ceil(total / limit)
          };
        } catch (e) {
          console.error("Prisma query failed, falling back to JSON...", e);
        }
      }

      // ── Fallback JSON DB ──
      const fallbackDb = initFallbackDb();
      let result = [...fallbackDb.colleges];

      if (filters?.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(c =>
          c.name.toLowerCase().includes(query) ||
          c.city.toLowerCase().includes(query) ||
          c.state.toLowerCase().includes(query) ||
          (c.courses || []).some(course => course.name.toLowerCase().includes(query))
        );
      }

      if (filters?.state) {
        result = result.filter(c => c.state === filters.state);
      }
      if (filters?.type) {
        result = result.filter(c => c.type === filters.type);
      }
      if (filters?.minFees) {
        result = result.filter(c => c.fees.max >= (filters.minFees || 0));
      }
      if (filters?.maxFees) {
        result = result.filter(c => c.fees.min <= (filters.maxFees || Infinity));
      }
      if (filters?.minRating) {
        result = result.filter(c => c.rating >= (filters.minRating || 0));
      }
      if (filters?.exam && filters.exam.length > 0) {
        const examMap: Record<string, string> = {
          'JEE Main': 'JEE_MAIN',
          'JEE Advanced': 'JEE_ADVANCED',
          'CAT': 'CAT',
          'NEET': 'NEET',
          'State CET': 'STATE_CET',
          'BITSAT': 'BITSAT',
          'CUET': 'CUET'
        };
        const mapped = filters.exam.map(e => examMap[e] || e);
        result = result.filter(c =>
          (c.predictorData || []).some(pd => mapped.includes(pd.exam))
        );
      }

      // Sort
      switch (filters?.sortBy) {
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'fees-asc':
          result.sort((a, b) => a.fees.min - b.fees.min);
          break;
        case 'fees-desc':
          result.sort((a, b) => b.fees.max - a.fees.max);
          break;
        default:
          result.sort((a, b) => (a.ranking || 999) - (b.ranking || 999));
          break;
      }

      const total = result.length;
      const totalPages = Math.ceil(total / limit);
      const paged = result.slice((page - 1) * limit, page * limit);

      return { colleges: paged, total, page, totalPages };
    },

    async findUnique(slug: string) {
      const useDb = await canUsePrisma();

      if (useDb) {
        try {
          const col = await prisma.college.findUnique({
            where: { slug },
            include: {
              reviews: {
                orderBy: { createdAt: 'desc' },
                include: {
                  user: { select: { name: true, image: true } }
                }
              },
              courses: true,
              predictorData: true
            }
          });

          if (!col) return null;

          const fees = col.fees as { min: number; max: number; currency: string };
          const placements = col.placements as { averageSalary: number; highestSalary: number; topRecruiters: string[]; placementRate: number };

          return {
            ...col,
            fees,
            placements,
            reviews: col.reviews.map(r => ({
              id: r.id,
              rating: r.rating,
              title: r.title,
              body: r.body,
              pros: r.pros || undefined,
              cons: r.cons || undefined,
              batch: r.batch || undefined,
              userId: r.userId,
              userName: r.user.name || "Anonymous",
              userImage: r.user.image || undefined,
              collegeId: r.collegeId,
              createdAt: r.createdAt.toISOString()
            }))
          };
        } catch (e) {
          console.error("Prisma unique query failed, falling back to JSON...", e);
        }
      }

      const fallbackDb = initFallbackDb();
      const col = fallbackDb.colleges.find(c => c.slug === slug);
      return col || null;
    },

    async getStats() {
      const fallbackDb = initFallbackDb();
      const colleges = fallbackDb.colleges;
      const totalColleges = colleges.length;
      const totalReviews = colleges.reduce((sum, c) => sum + (c.reviews?.length || 0), 0);
      const topStates = [...new Set(colleges.map(c => c.state))].length;
      const avgPlacement = Math.round(
        colleges.reduce((sum, c) => sum + (c.placements?.placementRate || 0), 0) / totalColleges
      );
      return { totalColleges, totalReviews, totalStates: topStates, avgPlacement };
    }
  },

  user: {
    async findByEmail(email: string) {
      const useDb = await canUsePrisma();
      if (useDb) {
        try {
          return await prisma.user.findUnique({ where: { email } });
        } catch (e) {
          console.error("Prisma user query failed...", e);
        }
      }
      const fallbackDb = initFallbackDb();
      const user = fallbackDb.users.find(u => u.email === email);
      return user || null;
    },
    async create(data: { name: string; email: string; passwordHash: string; image?: string }) {
      const useDb = await canUsePrisma();
      if (useDb) {
        try {
          return await prisma.user.create({
            data: {
              name: data.name,
              email: data.email,
              password: data.passwordHash,
              image: data.image
            }
          });
        } catch (e) {
          console.error("Prisma user creation failed...", e);
        }
      }
      const fallbackDb = initFallbackDb();
      const newUser = {
        id: `usr_${Date.now()}`,
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        image: data.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
        createdAt: new Date().toISOString()
      };
      fallbackDb.users.push(newUser);
      saveFallbackDb(fallbackDb);
      return newUser;
    }
  },

  review: {
    async create(data: { rating: number; title: string; body: string; userId: string; collegeId: string; pros?: string; cons?: string; batch?: number }) {
      const useDb = await canUsePrisma();
      if (useDb) {
        try {
          const review = await prisma.review.create({
            data: {
              rating: data.rating,
              title: data.title,
              body: data.body,
              pros: data.pros,
              cons: data.cons,
              batch: data.batch,
              userId: data.userId,
              collegeId: data.collegeId
            },
            include: {
              user: { select: { name: true, image: true } }
            }
          });
          // Update college review count and rating
          const reviews = await prisma.review.findMany({ where: { collegeId: data.collegeId } });
          const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
          await prisma.college.update({
            where: { id: data.collegeId },
            data: { rating: parseFloat(avgRating.toFixed(1)), reviewCount: reviews.length }
          });
          return review;
        } catch (e) {
          console.error("Prisma review creation failed...", e);
        }
      }
      const fallbackDb = initFallbackDb();
      const user = fallbackDb.users.find(u => u.id === data.userId) || { name: "Test User", image: undefined };
      const newReview: Review = {
        id: `rev_${Date.now()}`,
        rating: data.rating,
        title: data.title,
        body: data.body,
        pros: data.pros,
        cons: data.cons,
        batch: data.batch,
        userId: data.userId,
        userName: user.name,
        userImage: user.image,
        collegeId: data.collegeId,
        createdAt: new Date().toISOString()
      };
      const collegeIdx = fallbackDb.colleges.findIndex(c => c.id === data.collegeId);
      if (collegeIdx !== -1) {
        if (!fallbackDb.colleges[collegeIdx].reviews) fallbackDb.colleges[collegeIdx].reviews = [];
        fallbackDb.colleges[collegeIdx].reviews!.unshift(newReview);
        fallbackDb.colleges[collegeIdx].reviewCount = fallbackDb.colleges[collegeIdx].reviews!.length;
        const allR = fallbackDb.colleges[collegeIdx].reviews!;
        fallbackDb.colleges[collegeIdx].rating = parseFloat((allR.reduce((s, r) => s + r.rating, 0) / allR.length).toFixed(1));
      }
      saveFallbackDb(fallbackDb);
      return newReview;
    },

    async findByUserId(userId: string) {
      const useDb = await canUsePrisma();
      if (useDb) {
        try {
          const reviews = await prisma.review.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
              college: { select: { name: true, slug: true, imageUrl: true } },
              user: { select: { name: true, image: true } }
            }
          });
          return reviews.map(r => ({
            id: r.id,
            rating: r.rating,
            title: r.title,
            body: r.body,
            pros: r.pros || undefined,
            cons: r.cons || undefined,
            batch: r.batch || undefined,
            userId: r.userId,
            userName: r.user.name || "Anonymous",
            userImage: r.user.image || undefined,
            collegeId: r.collegeId,
            collegeName: r.college.name,
            collegeSlug: r.college.slug,
            collegeImage: r.college.imageUrl || undefined,
            createdAt: r.createdAt.toISOString()
          }));
        } catch (e) {
          console.error("Prisma find user reviews failed...", e);
        }
      }
      const fallbackDb = initFallbackDb();
      const results: any[] = [];
      for (const college of fallbackDb.colleges) {
        for (const rev of (college.reviews || [])) {
          if (rev.userId === userId) {
            results.push({
              ...rev,
              collegeName: college.name,
              collegeSlug: college.slug,
              collegeImage: college.imageUrl
            });
          }
        }
      }
      return results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    },

    async deleteById(reviewId: string, userId: string) {
      const useDb = await canUsePrisma();
      if (useDb) {
        try {
          const review = await prisma.review.findUnique({ where: { id: reviewId } });
          if (!review || review.userId !== userId) return null;
          await prisma.review.delete({ where: { id: reviewId } });
          // Update college stats
          const reviews = await prisma.review.findMany({ where: { collegeId: review.collegeId } });
          const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
          await prisma.college.update({
            where: { id: review.collegeId },
            data: { rating: parseFloat(avgRating.toFixed(1)), reviewCount: reviews.length }
          });
          return { deleted: true };
        } catch (e) {
          console.error("Prisma delete review failed...", e);
        }
      }
      const fallbackDb = initFallbackDb();
      for (const college of fallbackDb.colleges) {
        const idx = (college.reviews || []).findIndex(r => r.id === reviewId && r.userId === userId);
        if (idx !== -1) {
          college.reviews!.splice(idx, 1);
          college.reviewCount = college.reviews!.length;
          if (college.reviews!.length > 0) {
            college.rating = parseFloat((college.reviews!.reduce((s, r) => s + r.rating, 0) / college.reviews!.length).toFixed(1));
          }
          saveFallbackDb(fallbackDb);
          return { deleted: true };
        }
      }
      return null;
    }
  },

  savedCollege: {
    async toggle(userId: string, collegeId: string) {
      const useDb = await canUsePrisma();
      if (useDb) {
        try {
          const existing = await prisma.savedCollege.findUnique({
            where: { userId_collegeId: { userId, collegeId } }
          });
          if (existing) {
            await prisma.savedCollege.delete({ where: { id: existing.id } });
            return { action: 'removed' };
          } else {
            await prisma.savedCollege.create({ data: { userId, collegeId } });
            return { action: 'added' };
          }
        } catch (e) {
          console.error("Prisma savedCollege toggle failed...", e);
        }
      }
      const fallbackDb = initFallbackDb();
      const index = fallbackDb.savedColleges.findIndex(f => f.userId === userId && f.collegeId === collegeId);
      if (index !== -1) {
        fallbackDb.savedColleges.splice(index, 1);
        saveFallbackDb(fallbackDb);
        return { action: 'removed' };
      } else {
        fallbackDb.savedColleges.push({ id: `saved_${Date.now()}`, userId, collegeId });
        saveFallbackDb(fallbackDb);
        return { action: 'added' };
      }
    },

    async remove(userId: string, collegeId: string) {
      const useDb = await canUsePrisma();
      if (useDb) {
        try {
          const existing = await prisma.savedCollege.findUnique({
            where: { userId_collegeId: { userId, collegeId } }
          });
          if (existing) {
            await prisma.savedCollege.delete({ where: { id: existing.id } });
            return { removed: true };
          }
          return null;
        } catch (e) {
          console.error("Prisma remove saved failed...", e);
        }
      }
      const fallbackDb = initFallbackDb();
      const index = fallbackDb.savedColleges.findIndex(f => f.userId === userId && f.collegeId === collegeId);
      if (index !== -1) {
        fallbackDb.savedColleges.splice(index, 1);
        saveFallbackDb(fallbackDb);
        return { removed: true };
      }
      return null;
    },

    async findManyByUserId(userId: string) {
      const useDb = await canUsePrisma();
      if (useDb) {
        try {
          const saved = await prisma.savedCollege.findMany({
            where: { userId },
            include: {
              college: {
                include: {
                  reviews: { include: { user: { select: { name: true, image: true } } } },
                  courses: true,
                  predictorData: true
                }
              }
            }
          });
          return saved.map(s => {
            const col = s.college;
            const fees = col.fees as { min: number; max: number; currency: string };
            const placements = col.placements as { averageSalary: number; highestSalary: number; topRecruiters: string[]; placementRate: number };
            return {
              ...col,
              fees,
              placements,
              reviews: col.reviews.map(r => ({
                id: r.id,
                rating: r.rating,
                title: r.title,
                body: r.body,
                userId: r.userId,
                userName: r.user.name || "Anonymous",
                userImage: r.user.image || undefined,
                collegeId: r.collegeId,
                createdAt: r.createdAt.toISOString()
              }))
            };
          });
        } catch (e) {
          console.error("Prisma find saved colleges failed...", e);
        }
      }
      const fallbackDb = initFallbackDb();
      const favCollegeIds = fallbackDb.savedColleges.filter(f => f.userId === userId).map(f => f.collegeId);
      return fallbackDb.colleges.filter(c => favCollegeIds.includes(c.id));
    },

    async getIds(userId: string): Promise<string[]> {
      const useDb = await canUsePrisma();
      if (useDb) {
        try {
          const saved = await prisma.savedCollege.findMany({
            where: { userId },
            select: { collegeId: true }
          });
          return saved.map(s => s.collegeId);
        } catch (e) {
          console.error("Prisma get saved IDs failed...", e);
        }
      }
      const fallbackDb = initFallbackDb();
      return fallbackDb.savedColleges.filter(f => f.userId === userId).map(f => f.collegeId);
    }
  },

  predictor: {
    async predict(exam: string, category: string, rank: number) {
      const useDb = await canUsePrisma();
      const isScoreBased = exam === "CUET" || exam === "BITSAT";
      if (useDb) {
        try {
          const data = await prisma.predictorData.findMany({
            where: {
              exam,
              category,
              closingRank: isScoreBased ? { lte: rank * 1.05 } : { gte: rank * 0.8 }
            },
            include: { college: true }
          });
          return data;
        } catch(e) {
           console.error("Predictor failed...", e);
        }
      }
      const fallbackDb = initFallbackDb();
      const results: any[] = [];
      for(const col of fallbackDb.colleges) {
         if (col.predictorData) {
            for(const pd of col.predictorData) {
               if (pd.exam === exam && pd.category === category) {
                  const match = isScoreBased
                     ? pd.closingRank <= rank * 1.05
                     : pd.closingRank >= rank * 0.8;
                  if (match) {
                     results.push({ ...pd, college: col });
                  }
               }
            }
         }
      }
      return results;
    }
  }
};
