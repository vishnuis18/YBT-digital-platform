import { ICategory, IProduct, IFAQ } from "@/types";

export const SAMPLE_CATEGORIES: ICategory[] = [
  {
    _id: "cat_fullstack",
    name: "Full Stack Templates",
    slug: "full-stack-templates",
    description: "Production-ready web application boilerplate code and full-stack solutions.",
    icon: "Code2",
    isActive: true,
    productCount: 1,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    _id: "cat_uiux",
    name: "UI Design Systems",
    slug: "ui-ux-design-systems",
    description: "Figma kits, design systems, and responsive wireframes.",
    icon: "Layers",
    isActive: true,
    productCount: 1,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    _id: "cat_mobile",
    name: "Mobile App Kits",
    slug: "mobile-app-kits",
    description: "Flutter and React Native pre-built mobile app templates.",
    icon: "Zap",
    isActive: true,
    productCount: 1,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    _id: "cat_apis",
    name: "APIs & Microservices",
    slug: "apis-microservices",
    description: "Node.js, GraphQL, REST API architectures with built-in auth and payments.",
    icon: "Server",
    isActive: true,
    productCount: 1,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    _id: "cat_ai",
    name: "AI Prompts & Guides",
    slug: "ai-prompts-guides",
    description: "Curated AI engineering prompt packs and production guides.",
    icon: "Sparkles",
    isActive: true,
    productCount: 1,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];

export const SAMPLE_PRODUCTS: IProduct[] = [
  // 1. Full Stack Templates (1 sample product)
  {
    _id: "prod_fullstack_01",
    title: "SaaS Starter Kit Pro v2.0",
    slug: "saas-starter-kit-pro-v2",
    shortDescription:
      "Complete production-ready Next.js 15, TypeScript, Stripe & MongoDB SaaS boilerplate with RBAC and landing page.",
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
    category: SAMPLE_CATEGORIES[0],
    tags: ["Next.js", "React", "SaaS", "TypeScript", "Tailwind CSS"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
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
    createdAt: new Date("2026-02-15"),
    updatedAt: new Date("2026-02-15"),
  },

  // 2. UI Design Systems (1 sample product)
  {
    _id: "prod_ui_01",
    title: "Ultimate Figma Design System",
    slug: "ultimate-figma-design-system",
    shortDescription:
      "1,200+ auto-layout components, typography scales, color variables, and mobile/desktop responsive design tokens.",
    description: `### The ultimate UI kit for modern web & mobile apps.

Accelerate your product design workflow by 10x with this exhaustive, modular Figma component kit. Includes full Auto-Layout 5.0, variables, and dark mode variants.

#### Key Features:
- 🎨 **1,200+ Components**: Buttons, inputs, modals, navbars, charts, cards
- 📱 **Mobile & Desktop Variants**: Pre-built responsive layout frames
- 🌓 **Dark & Light Modes**: Seamless color token switching
- ⚡ **Auto-Layout 5.0**: Easily customize padding, constraints, and grids`,
    price: 79,
    salePrice: 39,
    category: SAMPLE_CATEGORIES[1],
    tags: ["Figma", "Design System", "UI/UX", "Auto-Layout", "Mobile UI"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
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
    createdAt: new Date("2026-02-10"),
    updatedAt: new Date("2026-02-10"),
  },

  // 3. Mobile App Kits (1 sample product)
  {
    _id: "prod_mobile_01",
    title: "Flutter Multi-Platform Commerce App",
    slug: "flutter-multiplatform-commerce-app",
    shortDescription:
      "Complete cross-platform iOS & Android mobile shopping app with clean architecture, Bloc state management, and dark mode.",
    description: `### Native iOS & Android App Solution

Build and deploy responsive mobile shopping apps for iOS and Android in record time. Features smooth animations, offline caching, and push notifications.

#### Key Features:
- 📱 **Cross-Platform**: 100% single codebase for iOS and Android
- 🧱 **BLoC State Management**: Clean, testable, enterprise architecture
- 💳 **Integrated Checkout**: Stripe, Apple Pay & Google Pay ready
- 🌐 **Multilingual & Multi-currency**: Built-in localization support`,
    price: 89,
    salePrice: 59,
    category: SAMPLE_CATEGORIES[2],
    tags: ["Flutter", "Dart", "iOS", "Android", "Mobile App"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop&q=80",
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
    createdAt: new Date("2026-02-05"),
    updatedAt: new Date("2026-02-05"),
  },

  // 4. APIs & Microservices (1 sample product)
  {
    _id: "prod_api_01",
    title: "Modern E-Commerce API Engine",
    slug: "modern-ecommerce-api-engine",
    shortDescription:
      "Microservices backend with Node.js, Express, MongoDB, Redis caching, Stripe & PayPal webhooks, and rate-limiting.",
    description: `### Production-Ready Digital Commerce API

A battle-tested backend engine designed for high-concurrency digital store operations. Includes full JWT auth, webhook verifications, cart engines, and dynamic coupons.

#### Key Features:
- 🚀 **Node.js, Express & TypeScript**: High-throughput microservice architecture
- 🔒 **Enterprise Security**: Rate limiting, CORS protection, JWT auth
- 💳 **Webhooks Ready**: Stripe, PayPal & Razorpay event listeners
- 📑 **Swagger OpenAPI 3.0**: Interactive documentation ready to test`,
    price: 59,
    salePrice: 35,
    category: SAMPLE_CATEGORIES[3],
    tags: ["Node.js", "Express", "MongoDB", "API", "Stripe", "Redis"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
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
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },

  // 5. AI Prompts & Guides (1 sample product)
  {
    _id: "prod_ai_01",
    title: "3,000+ Production AI Prompt Pack & Guide",
    slug: "3000-production-ai-prompt-pack",
    shortDescription:
      "Tested prompts and system instructions for GPT-4, Claude 3.5, and Midjourney across software, marketing, and SEO.",
    description: `### Master Artificial Intelligence for Development & Business

An exhaustive collection of 3,000+ battle-tested prompts categorized for code generation, architectural reviews, marketing copy, and automated workflows.

#### Key Features:
- 🤖 **3,000+ Verified Prompts**: Zero-shot, few-shot, and chain-of-thought templates
- 📚 **Notion Workspace**: Pre-organized, searchable prompt library database
- 💻 **Dev & Architecture**: Prompts for refactoring, test generation, and bug fixing
- 📈 **Growth & Marketing**: High-converting email copies, SEO briefs, and landing pages`,
    price: 29,
    salePrice: 19,
    category: SAMPLE_CATEGORIES[4],
    tags: ["AI", "ChatGPT", "Prompts", "Midjourney", "Productivity"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80",
    ],
    demoUrl: "https://demo.ybtdigital.com/ai-prompts",
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
    createdAt: new Date("2026-01-20"),
    updatedAt: new Date("2026-01-20"),
  },
];

export const SAMPLE_FAQS: IFAQ[] = [
  {
    _id: "faq_1",
    question: "How do I receive my digital product after purchase?",
    answer:
      "Immediately upon completing payment, you will be redirected to your Order Confirmation page with direct, secure download links. The files are also permanently available in your 'My Downloads' dashboard.",
    category: "Downloads & Licensing",
    order: 1,
    isPublished: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    _id: "faq_2",
    question: "What payment gateways are supported?",
    answer:
      "We support Stripe (Credit/Debit cards, Apple Pay, Google Pay), Razorpay (UPI, Netbanking, Cards), and PayPal. We also offer a fast Demo Checkout for testing.",
    category: "Billing & Payments",
    order: 2,
    isPublished: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    _id: "faq_3",
    question: "Are the digital products licensed for commercial use?",
    answer:
      "Yes! All digital items purchased on YBT Digital come with a standard commercial license allowing you to use them in unlimited client or personal commercial projects.",
    category: "Licensing",
    order: 3,
    isPublished: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    _id: "faq_4",
    question: "Can I get a refund if the digital product does not fit my needs?",
    answer:
      "We offer a 14-day satisfaction refund policy. Simply submit a support ticket from your user dashboard with your order number, and our team will review and process your refund.",
    category: "Refunds",
    order: 4,
    isPublished: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    _id: "faq_5",
    question: "Do I get lifetime updates for purchased products?",
    answer:
      "Yes. Whenever an author or developer releases an updated version of a template or guide, you can re-download the latest package directly from your My Downloads tab at no extra cost.",
    category: "Downloads & Updates",
    order: 5,
    isPublished: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];
