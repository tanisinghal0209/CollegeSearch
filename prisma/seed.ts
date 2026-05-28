import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ALL_COLLEGES, INITIAL_REVIEWS } from '../src/lib/mockData';

const prisma = new PrismaClient();

const mockUsers = [
  { id: "usr_alice", name: "Alice Johnson", email: "alice@campusiq.edu", password: "password123", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&q=80" },
  { id: "usr_bob", name: "Bob Smith", email: "bob@campusiq.edu", password: "password123", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&q=80" }
];

async function main() {
  console.log("Seeding database with Indian Colleges...");

  // Clean old data
  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.predictorData.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log("Creating users...");
  for (const user of mockUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        image: user.image
      }
    });
  }

  // Create Colleges
  console.log("Creating colleges, courses, and predictor data...");
  for (const col of ALL_COLLEGES) {
    await prisma.college.create({
      data: {
        id: col.id,
        name: col.name,
        slug: col.slug,
        location: col.location,
        city: col.city,
        state: col.state,
        type: col.type,
        established: col.established,
        ranking: col.ranking,
        rating: col.rating,
        reviewCount: col.reviewCount,
        imageUrl: col.imageUrl,
        bannerUrl: col.bannerUrl,
        website: col.website,
        description: col.description,
        fees: col.fees as any,
        placements: col.placements as any,
        facilities: col.facilities,
        courses: col.courses ? {
          create: col.courses.map(c => ({
            name: c.name,
            duration: c.duration,
            fees: c.fees,
            seats: c.seats
          }))
        } : undefined,
        predictorData: col.predictorData ? {
          create: col.predictorData.map(p => ({
            exam: p.exam,
            category: p.category,
            branch: p.branch,
            openingRank: p.openingRank,
            closingRank: p.closingRank,
            year: p.year
          }))
        } : undefined
      }
    });
  }

  // Create Reviews
  console.log("Creating reviews...");
  for (const review of INITIAL_REVIEWS) {
    await prisma.review.create({
      data: {
        rating: review.rating,
        title: review.title,
        body: review.body,
        pros: review.pros,
        cons: review.cons,
        batch: review.batch,
        userId: mockUsers[0].id,
        collegeId: review.collegeId!
      }
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
