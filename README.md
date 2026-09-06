# 🚀 YBT Digital

> A modern, full-stack digital product marketplace for discovering, purchasing, and securely downloading digital products.

YBT Digital is a production-oriented digital commerce platform built with **Next.js, TypeScript, Tailwind CSS, and MongoDB**.

The platform provides a complete digital-product purchasing experience, from browsing products and adding them to a cart to secure payment processing, order management, invoices, and protected digital downloads.

It also includes a powerful **Admin Dashboard** for managing products, users, orders, coupons, payments, analytics, support, FAQs, and website settings.

---

## ✨ Features

### 👤 User Features

* 🔐 User registration and login
* 🔑 Secure password reset
* 👨‍💻 User profile management
* 🔎 Product search
* 🏷️ Category filtering
* 💰 Price filtering
* 📈 Popularity sorting
* 🛍️ Product catalog
* 📦 Product details and screenshots
* 🛒 Shopping cart
* 🎟️ Coupon and discount system
* 💳 Secure checkout
* 💰 Multiple payment gateways
* 📋 Order history
* 📥 Secure digital downloads
* 🧾 Invoice/receipt generation
* 🎫 Customer support tickets
* ❓ FAQ section
* 🌙 Dark / Light mode
* 📱 Native-style mobile experience
* 💻 Responsive desktop experience

---

## 🛠️ Admin Features

### Dashboard

* Revenue overview
* Total users
* Total orders
* Total products
* Sales statistics
* Recent orders
* Top-selling products
* Sales analytics

### Product Management

* Add products
* Edit products
* Delete products
* Activate/deactivate products
* Product categories
* Product screenshots
* Digital file management
* Product pricing

### Order Management

* View all orders
* View transaction details
* Track payment status
* View customer information
* Refund management

### User Management

* View registered users
* Search users
* Block/unblock users
* View purchase history

### Coupon Management

* Percentage discounts
* Flat discounts
* Expiration dates
* Usage limits
* Coupon activation/deactivation

### Support Management

* View support tickets
* Respond to users
* Update ticket status
* Manage customer queries

### FAQ Management

* Create FAQs
* Edit FAQs
* Delete FAQs
* Publish/unpublish FAQs

### Website Settings

* Website branding
* Logo management
* Currency configuration
* GST/VAT configuration
* Payment gateway configuration
* Email notification settings

---

## 💻 Tech Stack

| Technology                | Purpose                    |
| ------------------------- | -------------------------- |
| **Next.js**               | Full-stack React framework |
| **React**                 | Frontend UI                |
| **TypeScript**            | Type-safe development      |
| **Tailwind CSS**          | Responsive styling         |
| **shadcn/ui**             | Reusable UI components     |
| **Lucide React**          | Icons                      |
| **MongoDB**               | Database                   |
| **Mongoose**              | MongoDB ODM                |
| **Node.js**               | Server-side runtime        |
| **JWT / Secure Sessions** | Authentication             |
| **bcrypt**                | Password hashing           |
| **Zod**                   | Input validation           |
| **Cloudinary**            | Image and media storage    |
| **Razorpay**              | Payment gateway            |
| **Stripe**                | Payment gateway            |
| **PayPal**                | Payment gateway            |
| **next-themes**           | Dark/Light mode            |

---

## 🏗️ Architecture

```text
ybt-digital/
│
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (user)/
│   ├── admin/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── admin/
│   └── user/
│
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── cloudinary.ts
│   ├── storage.ts
│   ├── utils.ts
│   └── validations/
│
├── models/
│   ├── User.ts
│   ├── Admin.ts
│   ├── Product.ts
│   ├── Category.ts
│   ├── Cart.ts
│   ├── Order.ts
│   ├── Payment.ts
│   ├── Coupon.ts
│   ├── Download.ts
│   ├── SupportTicket.ts
│   ├── FAQ.ts
│   ├── Setting.ts
│   └── PasswordReset.ts
│
├── services/
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── coupon.service.ts
│   ├── checkout.service.ts
│   ├── order.service.ts
│   ├── payment.service.ts
│   ├── download.service.ts
│   ├── storage.service.ts
│   └── analytics.service.ts
│
├── types/
│
├── middleware.ts
│
├── public/
│
├── .env.example
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🔄 User Flow

```text
Landing Page
      ↓
Product Listing
      ↓
Product Details
      ↓
Add to Cart / Buy Now
      ↓
Cart
      ↓
Apply Coupon
      ↓
Checkout
      ↓
Payment
      ↓
Order Confirmation
      ↓
Orders / Downloads
      ↓
Secure Digital Download
      ↓
Invoice
```

---

## 📱 Responsive Experience

YBT Digital follows a **mobile-first responsive design**.

### Mobile

* Native-style AppBar
* Bottom navigation
* Home
* Products
* Cart
* Profile
* Touch-friendly controls
* Full-width product cards
* Mobile-optimized checkout

### Desktop

* Professional navigation bar
* 3–4 product cards per row
* Dashboard sidebar
* Responsive tables
* Professional checkout experience

---

## 🌙 Dark & Light Mode

The application supports both:

* ☀️ Light Mode
* 🌙 Dark Mode

Theme preferences are persisted so users don't have to repeatedly select their preferred theme.

---

## 🔐 Security

Security is a major part of the application architecture.

Implemented security measures include:

* Password hashing with bcrypt
* Secure HTTP-only authentication cookies
* Server-side authorization
* Role-based access control
* Zod input validation
* MongoDB query sanitization
* XSS protection
* CSRF protection where applicable
* IDOR prevention
* Secure file upload validation
* MIME-type validation
* Protected digital downloads
* Payment verification
* Payment webhook signature verification
* Coupon validation on the server
* Duplicate payment prevention
* Rate-limiting architecture

---

## 👥 User Roles

### USER

Can:

* Browse products
* Add products to cart
* Purchase products
* Download purchased products
* Manage profile
* View orders
* Create support tickets

### EDITOR

Can manage selected:

* Products
* Product content
* FAQs
* Support content

### SUPER ADMIN

Has complete access to:

* Users
* Products
* Orders
* Payments
* Coupons
* Analytics
* Support
* FAQs
* Website settings

---

## 💳 Payment System

YBT Digital is designed with a multi-gateway payment architecture.

Supported gateways:

* Razorpay
* Stripe
* PayPal
* Demo Payment Mode

The active payment gateway can be configured by the administrator.

Production payment credentials should be stored securely using environment variables or protected server-side configuration.

---

## 📥 Secure Digital Downloads

Purchased digital files are protected from direct public access.

The download system verifies:

1. User authentication
2. Purchase ownership
3. Successful payment
4. Download authorization
5. Download expiry
6. Download limits

Downloads are logged for security and auditing.

---

## ☁️ Media Storage

Cloudinary is used for media such as:

* Product thumbnails
* Product screenshots
* Website logo
* Branding assets

Digital product files use a private storage architecture so that protected files are not exposed through public URLs.

---

## 🗄️ Database

MongoDB is used as the primary database with Mongoose.

Core models include:

* User
* Admin
* Product
* Category
* Cart
* Order
* Payment
* Coupon
* Download
* SupportTicket
* FAQ
* Setting
* PasswordReset

Indexes and validation are used for frequently accessed and unique fields.

---

## ⚙️ Environment Variables

Create a `.env.local` file based on `.env.example`.

Example:

```env
MONGODB_URI=

JWT_SECRET=

NEXT_PUBLIC_APP_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

PAYMENT_MODE=demo
```

Never commit real API keys or secrets to GitHub.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ybt-digital.git
```

### 2. Navigate to the project

```bash
cd ybt-digital
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create:

```text
.env.local
```

Add the required MongoDB, authentication, Cloudinary, and payment credentials.

### 5. Start the development server

```bash
npm run dev
```

### 6. Open the application

```text
http://localhost:3000
```

---

## 🧪 Development Mode

For development and testing, use:

```env
PAYMENT_MODE=demo
```

This allows the complete checkout and order flow to be tested without production payment credentials.

Before deploying to production, configure the required payment gateway credentials and webhook verification.

---

## 📊 Project Highlights

* ⚡ Next.js App Router
* 🔷 TypeScript
* 🍃 MongoDB + Mongoose
* 🎨 Tailwind CSS
* 🧩 Component-based architecture
* 🔐 Secure authentication
* 👥 Role-based access control
* 💳 Multi-payment gateway architecture
* 📦 Digital product management
* 📥 Secure downloads
* 🧾 Invoice generation
* 📊 Admin analytics
* 📱 Mobile-first responsive design
* 🌙 Dark/Light mode
* ☁️ Cloudinary integration

---

## 🎯 Future Improvements

Potential future enhancements include:

* AI-powered product recommendations
* Advanced sales analytics
* Product reviews and ratings
* Wishlist functionality
* Email automation
* Referral and affiliate system
* Subscription-based products
* Advanced search
* Real-time support chat
* Progressive Web App support

---

## 👨‍💻 Author

**Vishnu Irappa Sangammanavar**

Computer Science & Engineering
VIT Bhopal University

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is developed for educational and portfolio purposes.

Add an appropriate open-source license if you plan to distribute the source code publicly.
