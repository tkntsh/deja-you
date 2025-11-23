# Déjà You - Personal Digital Log

A beautiful, modern personal digital log application built with Next.js, allowing users to capture their thoughts, moments, and memories in a private space.

## ✨ Features

### Authentication
- **User Registration** - Create an account with email, username, and password
- **Secure Login** - Sign in with email or username
- **Password Hashing** - Bcrypt encryption for secure password storage
- **Form Validation** - Comprehensive Zod schema validation
- **Error Handling** - Clear, user-friendly error messages

### Dashboard
- **Post Composer** - Create new posts with a 280-character limit
- **Character Counter** - Real-time character tracking
- **My Posts** - View all your posts in chronological order
- **Post Management** - Delete posts with confirmation dialog
- **Profile Viewing** - Display user information and profile image
- **Profile Editing** - Update username, about section, and profile image
- **Image Upload** - Upload and preview profile images (max 5MB)
- **Tabbed Interface** - Easy navigation between Compose, Posts, and Profile

### Landing Page
- **Quote of the Day** - Display inspirational posts
- **Database Integration** - Real-time data from SQLite database
- **Beautiful UI** - Gradient backgrounds and modern design
- **Responsive Layout** - Works on all devices

### Design
- **Modern Aesthetics** - Purple/blue gradient color scheme
- **Dark Mode Ready** - Full dark mode support
- **Mobile Responsive** - Optimized for mobile, tablet, and desktop
- **Smooth Animations** - Hover effects and transitions
- **Professional Typography** - Clear hierarchy and readability
- **Touch-Friendly** - Large tap targets for mobile devices

### Technical Features
- **Next.js 16** - Latest React framework with App Router
- **TypeScript** - Full type safety
- **Drizzle ORM** - Type-safe database operations
- **SQLite** - Lightweight, serverless database
- **Tailwind CSS 4** - Utility-first CSS framework
- **Zod Validation** - Runtime type checking and validation
- **API Routes** - RESTful API with Next.js Route Handlers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deja-you
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate migrations
   npm run db:generate
   
   # Apply migrations
   npm run db:migrate
   
   # (Optional) Seed with sample data
   npx tsx seed.ts
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations
- `npm run db:studio` - Open Drizzle Studio (visual database manager)

## 🗄️ Database Schema

### Users Table
- `id` - Unique identifier (UUID)
- `username` - Unique username (3-20 characters)
- `email` - Unique email address
- `password` - Hashed password (bcrypt)
- `about` - User bio (max 160 characters)
- `profile_image` - Profile image path
- `is_admin` - Admin flag
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Posts Table
- `id` - Unique identifier (UUID)
- `content` - Post content (max 280 characters)
- `user_id` - Foreign key to users table
- `created_at` - Post creation timestamp
- `updated_at` - Last update timestamp

## 🎨 Design System

### Colors
- **Primary Gradient**: Purple (#9333EA) to Blue (#2563EB)
- **Background**: Light gradient (purple-50 → white → blue-50)
- **Dark Mode**: Gray-900 → Black → Purple-900
- **Text**: Gray-900 (light) / White (dark)
- **Accents**: Purple-600, Blue-600

### Typography
- **Headings**: Bold, gradient text
- **Body**: Clear, readable font sizes
- **Character Limits**: 280 for posts, 160 for about

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 📱 Mobile Compatibility

The application is fully responsive and optimized for mobile devices:

- **Flexible Layouts** - Adapts to all screen sizes
- **Touch-Friendly** - Large buttons and tap targets
- **Optimized Images** - Responsive image sizing
- **Mobile Navigation** - Simplified header on small screens
- **Stack Layouts** - Vertical stacking on mobile
- **Readable Text** - Appropriate font sizes for mobile

## 🔒 Security Features

- **Password Hashing** - Bcrypt with salt rounds
- **Input Validation** - Zod schemas for all forms
- **SQL Injection Protection** - Drizzle ORM parameterized queries
- **XSS Protection** - React's built-in escaping
- **File Upload Validation** - Type and size checking
- **Error Handling** - Secure error messages

## 📂 Project Structure

```
deja-you/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── posts/        # Post CRUD operations
│   │   └── profile/      # Profile update endpoint
│   ├── auth/             # Auth pages
│   │   ├── signin/       # Sign in page
│   │   └── signup/       # Sign up page
│   ├── dashboard/        # User dashboard
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── lib/                  # Shared utilities
│   └── validations.ts    # Zod schemas
├── public/               # Static assets
│   └── qotd-pfp.jpg     # Profile images
├── src/                  # Source code
│   ├── db/              # Database
│   │   ├── index.ts     # Database connection
│   │   └── schema.ts    # Drizzle schema
│   └── lib/             # Libraries
│       └── auth.ts      # NextAuth config
├── drizzle/             # Migration files
├── drizzle.config.ts    # Drizzle configuration
├── seed.ts              # Database seeding script
└── README.md            # This file
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.3
- **Language**: TypeScript 5
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Validation**: Zod 4
- **Authentication**: NextAuth 5 (beta)
- **Password Hashing**: bcryptjs
- **File Handling**: @vercel/blob

## 🎯 Future Enhancements

- [ ] Session management with NextAuth
- [ ] Post editing functionality
- [ ] Admin dashboard
- [ ] Search and filter posts
- [ ] Export data feature
- [ ] Multiple image uploads
- [ ] Rich text editor
- [ ] Tags and categories
- [ ] Dark mode toggle
- [ ] Email verification
- [ ] Password reset
- [ ] Two-factor authentication

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a personal project. Contributions are not currently accepted.

## 📧 Contact

For questions or support, please contact the project maintainer.

---

Built with ❤️ using Next.js and modern web technologies.
