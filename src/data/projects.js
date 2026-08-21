export const projects = [
  {
    slug: 'cultivarium',
    src: '/imgs/CultivariumScroll.png',
    alt: 'Cultivarium Scroll',
    tags: ['AI Tools', 'Scientific Tools'],
    description: 'AI-powered research tool to improve scientific protocol reproducibility.',
    defaultText: 'Augmented Scientific Protocols',
    video: '/imgs/EditingScreen.mp4',
    caseStudyLink: 'https://www.figma.com/deck/q54aPMelNBjtognApVQemv/AliceCook_2025Fulldeck_Public?node-id=32-625&viewport=-1723%2C62%2C0.4&t=2MsOR9EEvAWoj7Bx-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1',
    hasProjectPage: true,
  },
  {
    slug: 'chase-pay',
    src: '/imgs/ChasePayScroll.png',
    alt: 'ChasePay Scroll',
    tags: ['Fintech', 'Mobile App', 'E Commerce'],
    description: "Chase's first digital wallet enabling seamless transactions for millions of users.",
    defaultText: 'Pay with Points on Chase Pay',
    video: '/imgs/ChasePay.mp4',
    caseStudyLink: 'https://www.figma.com/deck/q54aPMelNBjtognApVQemv/AliceCook_2025Fulldeck_Public?node-id=118-934&viewport=-853%2C-470%2C0.4&t=aLy4TwMVv1SwTQ26-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1',
    hasProjectPage: true,
  },
  {
    slug: 'nulab',
    src: '/imgs/NulabScroll.png',
    alt: 'Nulab Scroll',
    tags: ['Design Systems', 'SEO Optimization'],
    description: 'Comprehensive design system and SEO improvements for better user experience.',
    defaultText: 'Design System and Domain Merge',
    caseStudyLink: 'https://www.figma.com/deck/q54aPMelNBjtognApVQemv/AliceCook_2025Fulldeck_Public?node-id=40000110-2170&viewport=-5835%2C-1235%2C0.44&t=e9SDlFxKNzOvQMiD-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1',
    hasProjectPage: true,
  },
  {
    src: '/imgs/CacooScroll.png',
    alt: 'Cacoo Scroll',
    tags: ['Workflow Tools', 'Design Systems'],
    description: 'Collaborative workflow tools with a cohesive design system.',
    defaultText: 'Online Diagramming Tool',
    caseStudyLink: 'https://www.figma.com/design/Dnw0a4vhZG83rldTlc85hi/Cacoo-Diagram-Access-Flows?node-id=0-1&t=kA2bL6Qvx0PXasOM-1',
    caseStudyLabel: 'View Figma',
  },
  {
    src: '/imgs/PointToPictureScroll.png',
    alt: 'PointToPicture Scroll',
    tags: ['AAC App', 'Ed Tech'],
    description: 'A mobile app that empowers behavioral technicians to communicate more clearly and compassionately with autistic and nonverbal children.',
    defaultText: 'Customizable AAC App',
    liveWebsiteLink: 'https://point2picture.com/',
  },
  {
    src: '/imgs/WeChatScroll.png',
    alt: 'WeChat Scroll',
    tags: ['AI Tools', 'Political Tech', 'Chat Bot'],
    description: 'An intelligent training chatbot that equips new volunteers with the skills and confidence to canvass and engage voters effectively.',
    defaultText: 'Chat Bot for Canvassers',
  },
  {
    src: '/imgs/FastPayScroll.png',
    alt: 'FastPay Scroll',
    tags: ['Fintech', 'Accessibility'],
    description: 'Problem\nAn internal accessibility audit revealed that the credit card payment flow, used by 80 percent of Chase\'s digital customers and visited as part of more than 200 million monthly site sessions, did not meet WCAG standards. Screen-reader users lacked orientation, keyboard navigation was inconsistent, and key payment information and actions were difficult to access.\n\nOutcomes\n• Launched a WCAG-compliant payment experience used by 35 million digital customers\n• Improved clarity and navigation for screen-reader and keyboard-only users\n• Reduced interaction friction by restructuring page hierarchy and standardizing controls\n• Usability testing confirmed the updated flow felt faster and easier to complete',
    defaultText: 'Accessibile Payments on Chase.com',
    liveWebsiteLink: 'https://www.chase.com/',
  },
  {
    src: '/imgs/MachineScroll.png',
    alt: 'Machine Scroll',
    tags: ['AI Tools', 'Digital Asset Management'],
    description: 'AI-driven platform for organizing and managing digital assets efficiently.',
    defaultText: 'Asset Finder for Content Creators',
  },
  {
    src: '/imgs/TekaloScroll.png',
    alt: 'Tekalo Scroll',
    tags: ['Branding', 'Social Impact'],
    description: 'Brand identity and digital presence for matching tech talent with social impact organizations.',
    defaultText: 'Matching Tech Workers with Impactful Opportunities',
    liveWebsiteLink: 'https://www.tekalo.org/',
  },
]

export const featuredProjects = projects.filter((project) => project.hasProjectPage)
export const gridProjects = projects.filter((project) => !project.hasProjectPage)

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug)
}
