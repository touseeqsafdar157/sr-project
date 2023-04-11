import {
  Activity,
  Home,
  Box,
  Server,
  Chrome,
  // DollarSign,
  // UserPlus,
  // Users,

  // Settings,
  Airplay,
  // FolderPlus,
  File,
  // Command,
  Cloud,
  // Book,
  // FileText,

  // Image,
  // Sliders,
  // Map,
  // GitPullRequest,
  // Calendar,
  // Edit,
  // Mail,
  // MessageSquare,
  // UserCheck,
  Layers,
  // HelpCircle,
  // Database,
  // Headphones,
  // Mic,
  // ShoppingBag,
  // Search,
  // AlertOctagon,
  // Lock,
  // Briefcase,
  // BarChart,
  // Target,
  // List,
  Package,
  Users,
  Paperclip,
} from "react-feather";

export const MENUITEMS = [
  {
    title: "Dashboard",
    icon: Home,
    classname: "icon-home mr-3",
    type: "link",
    path: "/dashboard/default",
    badgeType: "primary",
    active: false,
  },

  {
    title: "Company",
    icon: Box,
    classname: "icon-package mr-3",
    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      {
        path: "/company-listing",
        title: "Company Listing",
        type: "link",
      },
    ],
  },
  {
    title: "Investors",
    icon: Activity,
    classname: "icon-infinite mr-3",
    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      {
        path: "/investors-listing",
        title: "Investors Listing",
        type: "link",
      },
      {
        path: "/investor-request-listing",
        title: "Investor Request Listing",
        type: "link",
      },
    ],
  },

  {
    title: "Shareholdings",
    icon: Chrome,
    classname: "icon-money mr-3",

    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      {
        path: "/physical-file-uploader",
        title: "Physical File Uploader",
        type: "link",
      },
      {
        path: "/certificate-file-uploader",
        title: "Certiifcate File Uploader",
        type: "link",
      },
      {
        path: "/share-certificate-listing",
        title: "Share Certificate",
        type: "link",
      },
      {
        path: "/shareholder-listing",
        title: "Shareholding Listing",
        type: "link",
      },
      {
        path: "/shareholding-uploader",
        title: "CDC File Uploader",
        type: "link",
      },
    ],
  },
  {
    title: "Processing",
    icon: Layers,
    classname: "icon-bar-chart mr-3",
    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      {
        path: "/transaction-requests",
        title: "Transaction Requests",
        type: "link",
      },
    ],
  },
  {
    title: "Corporate",
    icon: Airplay,
    classname: "icon-announcement mr-3",
    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      {
        path: "/corporate-announcement-listing",
        title: "Corporate Announcement",
        type: "link",
      },
      {
        path: "/corporate-entitlement-listing",
        title: "Corporate Entitlements",
        type: "link",
      },
    ],
  },
  {
    title: "User Management",
    icon: Users,
    classname: "icon-user mr-3",
    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      {
        path: "/roles-listing",
        title: "Roles Listing",
        type: "link",
      },
    ],
  },
  {
    title: "Dividend Disbursement",
    icon: Cloud,
    classname: "icon-control-shuffle mr-3",
    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      {
        path: "/disbursement-listing",
        title: "Disbursement Listing",
        type: "link",
      },
    ],
  },
  {
    title: "Reporting",
    icon: Paperclip,
    classname: "icon-files mr-3",

    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      {
        path: "/shareholding-history",
        title: "Shareholding History",
        type: "link",
      },
      {
        path: "/right-allotment-report",
        title: "Right Allotment Report",
        type: "link",
      },
      {
        path: "/category-of-shareholding",
        title: "Category of Shareholding",
        type: "link",
      },
      // {
      //   path: "/free-float-report",
      //   title: "Free Float Report",
      //   type: "link",
      // },
      {
        path: "/bonus-allotment-report",
        title: "Bonus Allotment Report",
        type: "link",
      },
      {
        path: "/dividend-allotment-report",
        title: "Dividend Allotment Report",
        type: "link",
      },
      {
        path: "/investors-request-report",
        title: "Investors Request Report",
        type: "link",
      },
      {
        path: "/label-printing",
        title: "Label Printing",
        type: "link",
      },
      

    ],
  },
];
