# NAQL Freight Platform 🚛

A premium, modern logistics and freight management platform designed for the Saudi Arabian market. NAQL connects Shippers with Carriers through an advanced bidding and tracking system.

## 🚀 Features

- **Multi-Route Bidding**: Carriers can bid on complex, multi-leg shipments with granular pricing per segment.
- **Dynamic Dashboards**: Dedicated experiences for Shippers (load management, bid evaluation) and Carriers (load board, active trips).
- **Real-time Analytics**: Interactive charts and performance tracking using Recharts.
- **Bilingual Interface**: Full support for Arabic (RTL) and English (LTR).
- **Automated Workflows**: Automated reference number generation and status transitions (Assigned → In Transit → Delivered).
- **Premium UI**: Sleek, glassmorphic design with dark mode support and vibrant aesthetics.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Styling**: Tailwind CSS & CSS Variables
- **Components**: Radix UI
- **Icons**: Lucide React

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL database (or Neon/PlanetScale)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/naql"
SESSION_SECRET="your-secret-key"
```

### 4. Database Initialization
```bash
npx prisma db push
npx prisma generate
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

## 🔐 Test Credentials (Demo)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Shipper** | `ship3@test.com` | `password123` |
| **Carrier** | `car3@test.com` | `password123` |

*Note: Use these credentials to explore the platform's multi-route bidding and shipment management features.*

## 📄 License
MIT
