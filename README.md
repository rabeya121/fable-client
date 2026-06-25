# 📚 Fable – Ebook Sharing Platform

Fable is a modern digital platform that connects ebook lovers and readers with talented writers. Browse, discover, purchase, and read original ebooks — all in one place.

## 🌐 Live URL

🔗 [https://fable-client-omega.vercel.app](https://fable-client-omega.vercel.app)

> **Admin Credentials**
> - Email: `rabeya@gmail.com`
> - Password: `Rabeya123`
&&
> - Email: `admin@fable.com`
> - Password: `Admin@123`


---

## 🎯 Purpose

Traditional ebook reading is often limited to bookstores or libraries. Fable democratizes access to literature, enables emerging writers to reach global audiences, and provides a secure, streamlined reading and publishing experience.

---

## ✨ Key Features

### 👤 Authentication
- Email/password registration and login
- Google OAuth login via BetterAuth
- Better-Auth session management (expires in 7 days)
- Role selection after registration: **User (Reader)** or **Writer**

### 📖 Browse & Discovery
- Browse all published ebooks without login
- Search by title or writer name
- Filter by genre, price range, and availability
- Sort by newest, price low-to-high, price high-to-low
- Paginated ebook listing (6–12 per page)
- Skeleton loaders for smooth UX

### 🛒 Ebook Details & Purchase
- Full ebook info: cover image, title, writer, description, price, genre
- Stripe Checkout integration for secure purchase
- Full content unlocked after purchase
- Bookmark ebooks for later

### ✍️ Writer Dashboard (`/dashboard/writer`)
- Add, edit, delete, publish/unpublish ebooks
- Upload cover images via imgBB API
- View sales history with buyer details

### 🛡️ Admin Dashboard (`/dashboard/admin`)
- Manage all users: change roles, delete users
- Manage all ebooks: publish/unpublish, delete
- View all transactions (publishing fees + purchases)
- Analytics: total users, writers, ebooks, revenue
- Monthly sales bar chart & ebooks by genre pie chart

### 📋 User Dashboard (`/dashboard/user`)
- Purchase history table
- Purchased ebooks gallery
- Bookmarked ebooks gallery
- Profile management

### 💳 Payment System
- Stripe Checkout for ebook purchases
- Secure payment flow with success/failure handling
