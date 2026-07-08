import {
  BadgeDollarSign,
  Boxes,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Home,
  LayoutDashboard,
  PackageCheck,
  Settings,
  ShieldCheck,
  Store,
  Truck,
  Users,
} from 'lucide-react'
import { routes } from './routes'

export const storefrontNav = [
  { label: 'Categories', path: routes.stores, icon: Boxes },
  { label: 'On Sale', path: '/stores?sort=sale', icon: BadgeDollarSign },
  { label: "What's New", path: '/stores?sort=new', icon: PackageCheck },
  { label: 'Delivery', path: routes.orders, icon: Truck },
]

export const footerGroups = [
  {
    title: 'Company',
    links: ['About', 'Features', 'Works', 'Career'],
  },
  {
    title: 'Help',
    links: ['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'],
  },
  {
    title: 'FAQ',
    links: ['Account', 'Manage Deliveries', 'Orders', 'Payments'],
  },
  {
    title: 'Developers',
    links: ['Alok Kumar Jha', 'Bibek Kumar Jha', 'Nabil Ali Rain', 'Kushal Prasad Joshi'],
  },
]

export const vendorNav = [
  { label: 'Overview', path: routes.vendor, icon: LayoutDashboard },
  { label: 'Products', path: routes.vendorProducts, icon: Boxes },
  { label: 'Orders', path: routes.vendorOrders, icon: ClipboardList },
  { label: 'Storefront', path: routes.vendorStore, icon: Store },
]

export const adminNav = [
  { label: 'Overview', path: routes.admin, icon: Home },
  { label: 'Users', path: routes.adminUsers, icon: Users },
  { label: 'Disputes', path: routes.adminDisputes, icon: CircleHelp },
  { label: 'Transactions', path: routes.adminTransactions, icon: CreditCard },
  { label: 'Settings', path: routes.admin, icon: Settings },
  { label: 'Security', path: routes.admin, icon: ShieldCheck },
]

