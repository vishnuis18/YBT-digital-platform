import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ybt_digital";

async function seed() {
  console.log("Connecting to MongoDB for seeding...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  // Ensure storage dir exists
  const storageDir = path.resolve(process.cwd(), "storage/secure_files");
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  // Create demo digital asset files
  const sampleFiles = [
    { key: "saas_starter_kit_v2.zip", name: "SaaS Starter Kit Pro v2.0 Source Code.zip" },
    { key: "react_dashboard_ui.zip", name: "React Tailwind Dashboard System.zip" },
    { key: "ecommerce_api_bundle.zip", name: "Modern E-Commerce REST & GraphQL API Engine.zip" },
    { key: "mobile_flutter_app.zip", name: "Flutter Multi-Platform Mobile Commerce Template.zip" },
    { key: "ai_prompt_pack_3000.pdf", name: "3000+ Production AI Prompt Engineering Guide.pdf" },
    { key: "ui_figma_design_system.zip", name: "Ultimate Figma Design System & Component Library.zip" },
  ];

  for (const f of sampleFiles) {
    const filePath = path.join(storageDir, f.key);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(
        filePath,
        `=== YBT DIGITAL VERIFIED PRODUCT ASSET ===\nAsset: ${f.name}\nKey: ${f.key}\nLicensed to authorized customer.\nThank you for choosing YBT Digital!\n==========================================`
      );
    }
  }

  const collections = await mongoose.connection.db.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);

  // Clear existing collections if desired or drop
  console.log("Resetting seed data...");
  for (const name of [
    "users",
    "admins",
    "categories",
    "products",
    "coupons",
    "faqs",
    "settings",
    "orders",
    "payments",
    "downloads",
    "supporttickets",
  ]) {
    if (collectionNames.includes(name)) {
      await mongoose.connection.db.collection(name).deleteMany({});
    }
  }

  // 1. Create Admins
  const superAdminPassword = await bcrypt.hash("Admin@123", 10);
  const editorPassword = await bcrypt.hash("Editor@123", 10);
  const userPassword = await bcrypt.hash("User@123", 10);

  const adminCol = mongoose.connection.db.collection("admins");
  await adminCol.insertMany([
    {
      name: "Super Administrator",
      email: "admin@ybtdigital.com",
      password: superAdminPassword,
      role: "SUPER_ADMIN",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Content Editor",
      email: "editor@ybtdigital.com",
      password: editorPassword,
      role: "EDITOR",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 2. Create Demo User
  const userCol = mongoose.connection.db.collection("users");
  const demoUser = await userCol.insertOne({
    name: "Alex Morgan",
    email: "user@ybtdigital.com",
    password: userPassword,
    role: "user",
    isBlocked: false,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 3. Create Categories
  const categoryCol = mongoose.connection.db.collection("categories");
  const categoriesData = [
    {
      name: "Full Stack Templates",
      slug: "full-stack-templates",
      description: "Production-ready web application boilerplate code and full-stack solutions.",
      icon: "Code2",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "UI / UX Design Systems",
      slug: "ui-ux-design-systems",
      description: "Figma kits, design systems, and responsive wireframes.",
      icon: "Palette",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Mobile App Kits",
      slug: "mobile-app-kits",
      description: "Flutter and React Native pre-built mobile app templates.",
      icon: "Smartphone",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "APIs & Microservices",
      slug: "apis-microservices",
      description: "Node.js, GraphQL, REST API architectures with built-in auth and payments.",
      icon: "Server",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "AI Prompts & Guides",
      slug: "ai-prompts-guides",
      description: "Curated AI engineering prompt packs and production guides.",
      icon: "Sparkles",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const catResult = await categoryCol.insertMany(categoriesData);
  const catMap = {};
  for (const cat of await categoryCol.find({}).toArray()) {
    catMap[cat.slug] = cat._id;
  }

  // 4. Create Products
  const productCol = mongoose.connection.db.collection("products");
  const productsData = [
    {
      title: "SaaS Starter Kit Pro v2.0",
      slug: "saas-starter-kit-pro-v2",
      shortDescription: "Complete production-ready Next.js 15, TypeScript, Stripe & MongoDB SaaS boilerplate with RBAC and landing page.",
      description: `### Everything you need to launch a SaaS in days, not months.

**SaaS Starter Kit Pro** is designed specifically for solopreneurs, indie hackers, and software development agencies. Built on Next.js 15 App Router, TypeScript, Tailwind CSS, and MongoDB.

#### Key Features:
- ⚡ **Next.js 15 & React 19** with Server Actions
- 🛡️ **Role-Based Auth** (JWT, session cookies, OAuth ready)
- 💳 **Stripe & Razorpay Billing** with subscription webhooks & customer portals
- 📊 **Interactive Analytics Dashboard** with dark/light mode
- 🚀 **Full Documentation & Video Guides** included`,
      price: 99,
      salePrice: 49,
      category: catMap["full-stack-templates"],
      tags: ["Next.js", "React", "SaaS", "TypeScript", "Tailwind CSS", "MongoDB"],
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&auto=format&fit=crop&q=80",
      ],
      demoUrl: "https://demo.ybtdigital.com/saas-starter-kit",
      features: [
        "Full Next.js 15 App Router codebase",
        "Ready-to-use authentication & RBAC",
        "Stripe and Razorpay billing system",
        "Comprehensive documentation & Lifetime updates",
      ],
      fileKey: "saas_starter_kit_v2.zip",
      fileName: "SaaS-Starter-Kit-Pro-v2.0.zip",
      fileSize: 18450200,
      status: "active",
      salesCount: 142,
      rating: 4.9,
      reviewsCount: 38,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      updatedAt: new Date(),
    },
    {
      title: "Ultimate Figma Design System",
      slug: "ultimate-figma-design-system",
      shortDescription: "1,200+ auto-layout components, typography scales, color variables, and mobile/desktop responsive design tokens.",
      description: `### The ultimate UI kit for modern web & mobile apps.
Accelerate your product design workflow by 10x with this exhaustive, modular Figma component kit. Includes full Auto-Layout 5.0, variables, and dark mode variants.`,
      price: 79,
      salePrice: 39,
      category: catMap["ui-ux-design-systems"],
      tags: ["Figma", "Design System", "UI/UX", "Auto-Layout", "Mobile UI"],
      thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
      ],
      demoUrl: "https://figma.com/@ybtdigital",
      features: [
        "1,200+ Figma components with variants",
        "Figma variables for dynamic theming",
        "Full mobile and desktop screen templates",
        "Free lifetime updates",
      ],
      fileKey: "ui_figma_design_system.zip",
      fileName: "Ultimate-Figma-Design-System.fig",
      fileSize: 45200100,
      status: "active",
      salesCount: 215,
      rating: 5.0,
      reviewsCount: 62,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35),
      updatedAt: new Date(),
    },
    {
      title: "Modern E-Commerce API Engine",
      slug: "modern-ecommerce-api-engine",
      shortDescription: "Microservices backend with Node.js, Express, MongoDB, Redis caching, Stripe & PayPal webhooks, and rate-limiting.",
      description: `### Production-Ready Digital Commerce API
A battle-tested backend engine designed for high-concurrency digital store operations. Includes full JWT auth, webhook verifications, cart engines, and dynamic coupons.`,
      price: 59,
      salePrice: 35,
      category: catMap["apis-microservices"],
      tags: ["Node.js", "Express", "MongoDB", "API", "Stripe", "Redis"],
      thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
      ],
      demoUrl: "https://api-demo.ybtdigital.com/docs",
      features: [
        "Complete REST and GraphQL API routes",
        "Pre-built Stripe, PayPal & Razorpay webhook handlers",
        "Swagger OpenAPI 3.0 documentation included",
        "Docker container & CI/CD deployment workflows",
      ],
      fileKey: "ecommerce_api_bundle.zip",
      fileName: "Modern-Ecommerce-API-Engine.zip",
      fileSize: 15300000,
      status: "active",
      salesCount: 84,
      rating: 4.7,
      reviewsCount: 19,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      updatedAt: new Date(),
    },
    {
      title: "Flutter Multi-Platform Commerce App",
      slug: "flutter-multiplatform-commerce-app",
      shortDescription: "Complete cross-platform iOS & Android mobile shopping app with clean architecture, Bloc state management, and dark mode.",
      description: `### Native iOS & Android App Solution
Build and deploy responsive mobile shopping apps for iOS and Android in record time. Features smooth animations, offline caching, and push notifications.`,
      price: 89,
      salePrice: 59,
      category: catMap["mobile-app-kits"],
      tags: ["Flutter", "Dart", "iOS", "Android", "Mobile App"],
      thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80",
      ],
      demoUrl: "https://flutter-demo.ybtdigital.com",
      features: [
        "Flutter 3.x with null safety",
        "BLoC architecture with clean separation of concerns",
        "Multi-language (i18n) and multi-currency support",
        "Complete Figma design files included",
      ],
      fileKey: "mobile_flutter_app.zip",
      fileName: "Flutter-Multiplatform-Commerce.zip",
      fileSize: 32400000,
      status: "active",
      salesCount: 67,
      rating: 4.9,
      reviewsCount: 15,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
      updatedAt: new Date(),
    },
    {
      title: "3000+ Production AI Prompt Pack & Guide",
      slug: "3000-production-ai-prompt-pack",
      shortDescription: "Tested prompts and system instructions for GPT-4, Claude 3.5, and Midjourney across software, marketing, and SEO.",
      description: `### Master Artificial Intelligence for Development & Business
An exhaustive collection of 3,000+ battle-tested prompts categorized for code generation, architectural reviews, marketing copy, and automated workflows.`,
      price: 29,
      salePrice: 19,
      category: catMap["ai-prompts-guides"],
      tags: ["AI", "ChatGPT", "Prompts", "Midjourney", "Productivity"],
      thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      ],
      demoUrl: "",
      features: [
        "3,000+ tested prompts across 20+ domains",
        "Notion workspace template included",
        "PDF & Markdown versions with instant search",
        "Quarterly prompt updates included",
      ],
      fileKey: "ai_prompt_pack_3000.pdf",
      fileName: "3000-Production-AI-Prompts.pdf",
      fileSize: 8400000,
      status: "active",
      salesCount: 310,
      rating: 5.0,
      reviewsCount: 89,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40),
      updatedAt: new Date(),
    },
  ];

  const productResult = await productCol.insertMany(productsData);
  console.log(`Inserted ${productsData.length} products.`);

  // 5. Create Coupons
  const couponCol = mongoose.connection.db.collection("coupons");
  await couponCol.insertMany([
    {
      code: "YBT20",
      discountType: "percentage",
      discountValue: 20,
      minOrderAmount: 20,
      maxDiscountAmount: 50,
      maxUsage: 500,
      usedCount: 14,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: "WELCOME50",
      discountType: "percentage",
      discountValue: 50,
      minOrderAmount: 40,
      maxDiscountAmount: 100,
      maxUsage: 100,
      usedCount: 42,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: "FLAT10",
      discountType: "flat",
      discountValue: 10,
      minOrderAmount: 30,
      maxDiscountAmount: null,
      maxUsage: 1000,
      usedCount: 5,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 6. Create FAQs
  const faqCol = mongoose.connection.db.collection("faqs");
  await faqCol.insertMany([
    {
      question: "How do I receive my digital product after purchase?",
      answer: "Immediately upon completing payment, you will be redirected to your Order Confirmation page with direct, secure download links. The files are also permanently available in your 'My Downloads' dashboard.",
      category: "Downloads & Licensing",
      order: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      question: "What payment gateways are supported?",
      answer: "We support Stripe (Credit/Debit cards, Apple Pay, Google Pay), Razorpay (UPI, Netbanking, Cards), and PayPal. We also offer a fast Demo Checkout for testing.",
      category: "Billing & Payments",
      order: 2,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      question: "Are the digital products licensed for commercial use?",
      answer: "Yes! All digital items purchased on YBT Digital come with a standard commercial license allowing you to use them in unlimited client or personal commercial projects.",
      category: "Licensing",
      order: 3,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      question: "Can I get a refund if the digital product does not fit my needs?",
      answer: "We offer a 14-day satisfaction refund policy. Simply submit a support ticket from your user dashboard with your order number, and our team will review and process your refund.",
      category: "Refunds",
      order: 4,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      question: "Do I get lifetime updates for purchased products?",
      answer: "Yes. Whenever an author or developer releases an updated version of a template or guide, you can re-download the latest package directly from your My Downloads tab at no extra cost.",
      category: "Downloads & Updates",
      order: 5,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 7. Create Settings
  const settingCol = mongoose.connection.db.collection("settings");
  await settingCol.insertOne({
    key: "global_settings",
    value: {
      payment: {
        activeGateway: "demo",
        enableDemo: true,
        razorpay: {
          keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
          keySecret: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_placeholder",
          enabled: true,
        },
        stripe: {
          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
          secretKey: process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
          webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder",
          enabled: true,
        },
        paypal: {
          clientId: process.env.PAYPAL_CLIENT_ID || "paypal_client_placeholder",
          clientSecret: process.env.PAYPAL_CLIENT_SECRET || "paypal_secret_placeholder",
          mode: "sandbox",
          enabled: true,
        },
      },
      tax: {
        enabled: true,
        taxName: "GST / VAT",
        taxRate: 18,
        includedInPrice: false,
      },
      branding: {
        siteName: "YBT Digital",
        siteTagline: "Premium Digital Products, Templates & Software Assets",
        logoUrl: "/images/logo.png",
        footerText: "© 2026 YBT Digital. All rights reserved. Built for modern developers and creators.",
        supportEmail: "support@ybtdigital.com",
        supportPhone: "+1 (555) 019-2834",
        currency: "USD",
        currencySymbol: "$",
      },
      email: {
        orderConfirmation: true,
        failedPayment: true,
        ticketReply: true,
        fromEmail: "notifications@ybtdigital.com",
      },
    },
    description: "Global Store Configuration",
    updatedAt: new Date(),
  });

  console.log("Database seeded successfully with rich demo data!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
