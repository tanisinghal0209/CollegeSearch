# CampusIQ — College Discovery & Admission Predictor

CampusIQ is an elegant, responsive, and accessible web application designed to help students discover, compare, and analyze higher education institutions in India. It features a modern, premium, high-contrast light-themed user interface, complete with smart search filters, a side-by-side comparison deck, and an admission predictor based on historical cutoff ranks.

---

## 🚀 Key Features

*   **🔍 Intuitive Search & Registry Filters**: Filter through 500+ top-ranked colleges dynamically by location (state), institution type (Government vs. Private), accepted entrance exams, minimum user rating, and annual fee ranges.
*   **📊 Side-by-Side Comparison Deck**: Select and compare up to 3 colleges side-by-side on critical metrics: ranking, fees, average/highest placement packages, placement rates, website links, ratings, and top recruiter lists.
*   **🎯 Smart Rank Predictor**: Input entrance exam ranks (JEE Main, JEE Advanced, NEET, CAT, BITSAT) and student category to predict matching colleges based on historical cutoff databases.
*   **⭐ Student reviews & ratings**: View and submit detailed student reviews with numeric ratings, title, content, batch year, and quick pros & cons tags.
*   **👤 Custom User Dashboard**: Manage bookmarked/saved colleges and view, edit, or delete personal reviews.
*   **🛡️ Multi-Tier Database Fallback**: Built with a database connection manager that queries PostgreSQL (via Prisma) but falls back gracefully in 2 seconds to local JSON mock data if the database is down or slow, ensuring 100% uptime.

---

## 🛠️ Technology Stack

*   **Frontend & Routing**: [Next.js](https://nextjs.org/) (App Router, Turbopack) & [React](https://react.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (modern responsive grid, smooth animations, premium micro-interactions)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (for comparison deck active states)
*   **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest) (for performant, cached server requests)
*   **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with Serverless [PostgreSQL](https://www.postgresql.org/)
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/) (OAuth and Credentials providers)
*   **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

---

## ⚙️ Local Development Setup

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended) and a running PostgreSQL instance (optional, as the project falls back to JSON DB).

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/tanisinghal0209/CollegeSearch.git
cd CollegeSearch
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the root directory and configure the environment variables:
```env
# PostgreSQL Connection URL (optional - falls back to local JSON if omitted/unreachable)
DATABASE_URL="postgresql://username:password@localhost:5432/campusiq?schema=public"

# NextAuth Configuration
NEXTAUTH_SECRET="your_long_random_jwt_encryption_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding (Prisma)
If you are using PostgreSQL, push the database schema and seed the initial dataset:
```bash
# Push schema structure to database
npx prisma db push

# Seed database with initial mock colleges, cutoffs, and reviews
npx prisma db seed
```

### 5. Running the Application
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Production Deployment

### 1. Database Hosting (Neon)
We recommend deploying your PostgreSQL instance to [Neon](https://neon.tech/):
1. Create a project on Neon.
2. Copy the connection string.
3. Push the database schema structure from your local terminal targeting the Neon URL.

### 2. Frontend Hosting (Vercel)
Deploy the Next.js app to [Vercel](https://vercel.com/):
1. Connect your GitHub repository.
2. Configure environment variables in the project settings:
   * Add `DATABASE_URL` (your Neon connection string).
   * Add `NEXTAUTH_SECRET` (your random authentication secret key).
3. Click **Deploy**. Vercel will automatically build and publish the app.
