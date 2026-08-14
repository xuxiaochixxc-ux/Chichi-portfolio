export type ViewId = "about" | "work" | "beyond";

export type NavItem = {
  id: ViewId;
  image: string;
  labelLine1: string;
  labelLine2: string;
};

export const navItems: NavItem[] = [
  { id: "about", image: "/assets/navigation/about.png", labelLine1: "ABOUT", labelLine2: "MEET ME" },
  { id: "work", image: "/assets/navigation/work.png", labelLine1: "WORK", labelLine2: "VIEW MY WORK" },
  { id: "beyond", image: "/assets/navigation/beyond.png", labelLine1: "BEYOND", labelLine2: "OFF THE CLOCK" },
];

export type FutureResource = { label: string; url: string };
export type FutureMedia = { src: string; alt: string; type?: "image" | "video" };
export type FutureReadyFields = {
  media: FutureMedia[];
  documents: FutureResource[];
  externalLinks: FutureResource[];
  caseStudyUrl: string | null;
  projectUrl: string | null;
};

export type LocalizedText = {
  en: string;
  zh: string;
};

export type Contribution = {
  index?: string;
  title: string;
  bodyKey: string;
  emphasis?: {
    en: string[];
    zh: string[];
  };
};

export type Internship = FutureReadyFields & {
  id: string;
  company: string;
  role: string;
  period: string;
  tags: string[];
  overviewKey: string;
  coreSkills?: LocalizedText;
  contributions: Contribution[];
};

const emptyResources = (): FutureReadyFields => ({
  media: [], documents: [], externalLinks: [], caseStudyUrl: null, projectUrl: null,
});

export const internships: Internship[] = [
  {
    id: "intern-converge", company: "Converge AI · Enter Pro", role: "Global Content & Product Growth Intern / 海外内容与产品增长实习生", period: "2026.04 — 2026.08", tags: ["AI PRODUCT", "GTM", "GLOBAL GROWTH"], overviewKey: "work.internship.0.overview",
    coreSkills: {
      en: "Product Marketing & GTM | Global Content Operations | AI Vibe Coding | Campaign Execution",
      zh: "产品营销与 GTM｜海外内容运营｜AI Vibe Coding｜Campaign 执行",
    },
    contributions: [
      {
        index: "01",
        title: "GLOBAL CONTENT OPERATIONS / 海外内容矩阵运营",
        bodyKey: "work.internship.0.contribution.0",
        emphasis: {
          en: ["13 channels", "230+ cross-platform content pieces", "50+ video assets", "3.8M+ impressions/views", "15.9% follower growth", "148% growth"],
          zh: ["13 个渠道", "230+ 条跨平台内容", "50+ 支视频素材", "380 万+曝光/播放", "X 主账号粉丝增长 15.9%", "Instagram 粉丝增长 148%"],
        },
      },
      {
        index: "02",
        title: "PRODUCT MARKETING & GTM / 产品营销与 GTM",
        bodyKey: "work.internship.0.contribution.1",
        emphasis: {
          en: ["17+ product launches and feature updates", "Agent Builder campaign", "367K impressions", "74K views", "32.3K website visits", "$0.0035"],
          zh: ["17+ 次产品功能更新与 Launch", "Agent Builder Campaign", "36.7 万次曝光", "7.4 万次观看", "3.23 万次网站访问", "$0.0035"],
        },
      },
      {
        index: "03",
        title: "AI VIBE CODING / AI Vibe Coding",
        bodyKey: "work.internship.0.contribution.2",
        emphasis: {
          en: ["9+ interactive Web Prototypes / Demos", "Business Dashboards, Marketplace experiences, Toybox concepts", "product concept validation with user-facing communication"],
          zh: ["9+ 个可交互 Web Prototype / Demo", "Business Dashboard、Marketplace、Toybox", "产品概念验证到用户传播"],
        },
      },
      {
        index: "04",
        title: "CREATOR COLLABORATIONS & CAMPAIGN EXECUTION / 达人合作与 Campaign 执行",
        bodyKey: "work.internship.0.contribution.3",
        emphasis: {
          en: ["10+ international creators", "8+ creator collaborations", "12+ repost/co-created content pieces", "799 total interactions"],
          zh: ["10+ 位海外创作者", "8+ 次达人共创", "12+ 条 Repost / 共创内容", "799 次互动"],
        },
      },
    ], ...emptyResources(),
  },
  {
    id: "intern-ey", company: "EY | AI Consulting / 安永咨询｜AI咨询部门", role: "AI Consulting Project Assistant / AI咨询项目助理", period: "2026.02 – 2026.04", tags: ["DATA ANALYSIS", "STRUCTURED COMMUNICATION", "PROJECT SUPPORT"], overviewKey: "work.internship.1.overview",
    coreSkills: {
      en: "Data Analysis | Structured Communication | Project Support",
      zh: "数据分析｜结构化表达｜项目支持",
    },
    contributions: [
      {
        index: "01",
        title: "INDUSTRY & COMPETITIVE RESEARCH / 行业行研与竞品分析",
        bodyKey: "work.internship.1.contribution.0",
        emphasis: {
          en: ["5+ core competitors", "20,000+ Chinese-character trend insight report"],
          zh: ["5+ 核心竞品", "2 万字+ 趋势洞察报告"],
        },
      },
      {
        index: "02",
        title: "WORKFLOW STRUCTURING & DEVELOPMENT / 业务流程梳理与搭建",
        bodyKey: "work.internship.1.contribution.1",
        emphasis: {
          en: ["6 team collaboration SOPs", "efficiency by approximately 20%"],
          zh: ["6 套团队协作 SOP", "效率提升约 20%"],
        },
      },
      {
        index: "03",
        title: "REPORT DEVELOPMENT / 报告撰写",
        bodyKey: "work.internship.1.contribution.2",
        emphasis: {
          en: ["4 phased presentation decks for major clients"],
          zh: ["4 份面向大客户"],
        },
      },
    ], ...emptyResources(),
  },
  {
    id: "intern-juzhi", company: "Juzhi Education / 炬智教育", role: "Content Growth Intern / 内容增长实习生", period: "2025.10 – 2026.02", tags: ["CONTENT MARKETING", "DATA-DRIVEN GROWTH", "CAMPAIGN"], overviewKey: "work.internship.2.overview",
    coreSkills: {
      en: "Content Marketing | Data-driven Growth | Campaign Execution",
      zh: "内容营销｜数据增长｜Campaign执行",
    },
    contributions: [
      {
        index: "01",
        title: "MARKETING CAMPAIGN PLANNING & USER GROWTH / 营销Campaign策划与用户增长",
        bodyKey: "work.internship.2.contribution.0",
        emphasis: {
          en: ["10+ breakout videos exceeding 100K views", "180% follower growth"],
          zh: ["10 条以上 10w+ 播放浏览", "180% 增长"],
        },
      },
      {
        index: "02",
        title: "AI- & DATA-DRIVEN STRATEGY MODEL DEVELOPMENT / 基于AI与数据的策略模型搭建",
        bodyKey: "work.internship.2.contribution.1",
        emphasis: {
          en: ["Python and AI tools", "100+ high-performing content pieces and creator accounts"],
          zh: ["Python 与 AI 工具", "100+ 高表现内容及创作者账号"],
        },
      },
      {
        index: "03",
        title: "WORKFLOW & SOP OPTIMIZATION / 业务SOP流程优化",
        bodyKey: "work.internship.2.contribution.2",
        emphasis: {
          en: ["standardized SOPs", "reduced the production and delivery cycle per video to one-third of its original length"],
          zh: ["制定标准化SOP", "缩短至原先的 1/3"],
        },
      },
    ], ...emptyResources(),
  },
  {
    id: "intern-xigui", company: "Shanghai Xigui Technology / 上海熙硅科技有限公司", role: "Social Media Growth Intern / 社媒增长实习生", period: "2025.06 – 2025.08", tags: ["CONTENT STRATEGY", "DATA ANALYSIS", "OPERATIONS"], overviewKey: "work.internship.3.overview",
    coreSkills: {
      en: "Content Strategy | Data Analysis | Operations Execution",
      zh: "内容策略｜数据分析｜运营执行",
    },
    contributions: [
      {
        index: "01",
        title: "WORKFLOW & SOP OPTIMIZATION / 业务SOP流程优化",
        bodyKey: "work.internship.3.contribution.0",
        emphasis: {
          en: ["account matrix from 0 to 1", "100K+ cumulative brand exposure", "120%"],
          zh: ["账号矩阵从0到1搭建", "10 万+", "120%"],
        },
      },
      {
        index: "02",
        title: "CREATOR & KOL SCREENING SUPPORT / 创作者/KOL筛选支持",
        bodyKey: "work.internship.3.contribution.1",
        emphasis: {
          en: ["Huitun Data", "account performance, audience profiles, and content engagement data"],
          zh: ["灰豚数据", "账号表现、受众特征与内容互动数据"],
        },
      },
      {
        index: "03",
        title: "TECHNICAL TESTING / 技术测试",
        bodyKey: "work.internship.3.contribution.2",
        emphasis: {
          en: ["A/B test", "2 weeks", "content distribution efficiency by 40%"],
          zh: ["A/B测试", "2 周", "内容分发效率提升 40%"],
        },
      },
    ], ...emptyResources(),
  },
  {
    id: "intern-jinqiao", company: "Jinqiao Group | Division III / 金桥集团｜事业三部", role: "Design Operations Intern / 设计运营实习生", period: "2023.06 – 2023.08", tags: ["CASE RESEARCH", "CONTENT TRANSFORMATION", "STRUCTURED COMMUNICATION"], overviewKey: "work.internship.4.overview",
    coreSkills: {
      en: "Case Research | Content Transformation | Structured Communication",
      zh: "案例研究｜内容转化｜结构化表达",
    },
    contributions: [
      {
        index: "01",
        title: "INTERNATIONAL CASE RESEARCH / 国际案例研究",
        bodyKey: "work.internship.4.contribution.0",
        emphasis: {
          en: ["Canary Wharf waterfront area in London", "12,000-word case study", "1,500+ reads"],
          zh: ["伦敦金丝雀码头滨水区", "1.2 万字案例报告", "1500+"],
        },
      },
      {
        index: "02",
        title: "CROSS-FUNCTIONAL COLLABORATION & DATA PROCESSING / 跨部门协作与数据处理",
        bodyKey: "work.internship.4.contribution.1",
        emphasis: {
          en: ["10+ design and proposal review meetings"],
          zh: ["10+ 场设计方与集团方案评审会"],
        },
      },
    ], ...emptyResources(),
  },
];

export type SelectedProject = FutureReadyFields & {
  id: string;
  number: string;
  title: string;
  year: string;
  tags: string[];
  summaryKey: string;
  descriptionKey: string;
  role: string;
  roleZh: string;
  coverImage?: string;
  liveUrl?: string;
  githubUrl?: string;
  showcaseCopy?: {
    en: [string, string];
    zh: [string, string];
  };
};

export type ProjectGroup = { id: string; label: string; items: SelectedProject[] };

export const selectedWorkGroups: ProjectGroup[] = [
  {
    id: "ai-prototypes", label: "AI Product Experiments / Vibe Coding项目探索", items: [
      { id: "project-wwdc-generator", number: "A01", title: "Idea-to-App Generator", year: "2026", tags: ["AI PRODUCT CONCEPT", "INTERACTIVE WEB", "PRODUCT PROTOTYPING"], coverImage: "/assets/projects/wwdc-generator.png", liveUrl: "https://84d49a5f43824c41b05b6ef8d3090d68.prod.enterapp.pro", githubUrl: "https://github.com/xuxiaochixxc-ux/wwdc-app-lab", summaryKey: "work.project.a01.summary", descriptionKey: "work.project.a01.description", role: "", roleZh: "", showcaseCopy: { en: ["An AI-powered product prototyping experience that transforms raw app ideas into launch-ready concepts.", "Users can define an app idea, target users, platform, and style direction, then generate product positioning, feature structure, workflows, an interactive preview, and launch materials."], zh: ["一款产品全流程原型体验 App，将原始 App 想法变成可以交互的原型界面，最终转化为可进入发布阶段的完整概念。", "用户可以自行定义 App 创意、目标用户、平台与风格方向，并生成产品定位、功能结构、工作流程、互动预览与发布物料，以开发者的角色深度体验产品脑爆的全流程。"] }, ...emptyResources() },
      { id: "project-spatial-moodboard", number: "A02", title: "3D Spatial Moodboard Canvas", year: "2026", tags: ["WEBGL", "THREE.JS", "INTERACTIVE EXPERIENCE"], coverImage: "/assets/projects/spatial-moodboard.png", liveUrl: "https://298dcf987ab1471fa83c6f404e621fe5.prod.enterapp.pro/", githubUrl: "https://github.com/xuxiaochixxc-ux/kinetic-canvas", summaryKey: "work.project.a02.summary", descriptionKey: "work.project.a02.description", role: "", roleZh: "", showcaseCopy: { en: ["An interactive 3D visual workspace that transforms images and videos into spatial moodboards.", "Users can arrange visual assets through multiple layouts, explore depth-based interactions, and customize motion, atmosphere, and composition through an editorial control system."], zh: ["一个将图片与视频转化为空间情绪板的互动式 3D 视觉工作区。", "用户可以通过多种布局组织视觉素材，探索基于景深的互动，并通过编辑式控制系统调整运动、氛围与构图。"] }, ...emptyResources() },
      { id: "project-toybox-portrait", number: "A03", title: "Toybox Portrait Generator", year: "2026", tags: ["AI CREATIVE TOOL", "IMAGE GENERATION", "USER EXPERIENCE"], coverImage: "/assets/projects/toybox-portrait.png", liveUrl: "https://334315de77064ba29c2480354f262185.prod.enterapp.pro/", githubUrl: "https://github.com/xuxiaochixxc-ux/toy-world", summaryKey: "work.project.a03.summary", descriptionKey: "work.project.a03.description", role: "", roleZh: "", showcaseCopy: { en: ["An AI creative tool that transforms ordinary photos into personalized 3D toy-world portraits.", "Users can explore different scenes, moods, and visual styles to create playful character experiences designed for customization and sharing."], zh: ["一款将普通照片转化为个性化 3D 玩具世界肖像的 AI 创意工具。", "用户可以探索不同场景、情绪与视觉风格，创造适合个性化定制与分享的趣味角色体验。"] }, ...emptyResources() },
    ],
  },
  {
    id: "research-strategy", label: "B. RESEARCH & STRATEGY / 研究与策略", items: [
      { id: "project-content-model", number: "B01", title: "AI-Assisted Content Strategy Model / AI 辅助内容策略模型", year: "2025", tags: ["GROWTH STRATEGY", "PYTHON", "AI ANALYSIS"], summaryKey: "work.project.b01.summary", descriptionKey: "work.project.b01.description", role: "Research Design · Data Organization · AI Analysis · Strategy Framework", roleZh: "研究设计 · 数据整理 · AI 分析 · 策略框架", ...emptyResources() },
      { id: "project-gtm", number: "B02", title: "AI Builder GTM & Competitive Landscape / AI 应用构建产品 GTM 与竞品研究", year: "2026", tags: ["PRODUCT MARKETING", "COMPETITIVE RESEARCH", "GTM"], summaryKey: "work.project.b02.summary", descriptionKey: "work.project.b02.description", role: "Competitive Research · Product Analysis · Messaging · GTM Strategy", roleZh: "竞品研究 · 产品分析 · 产品表达 · GTM 策略", ...emptyResources() },
      { id: "project-urban-data", number: "B03", title: "Multi-source Urban Data Integration Platform / 多源城市数据整合与分析平台", year: "2025 — PRESENT / 至今", tags: ["DATA SYSTEM", "AUTOMATION", "URBAN RESEARCH"], summaryKey: "work.project.b03.summary", descriptionKey: "work.project.b03.description", role: "Data Standardization · Workflow Design · Python Automation · System Planning", roleZh: "数据标准化 · 流程设计 · Python 自动化 · 系统规划", ...emptyResources() },
    ],
  },
];
