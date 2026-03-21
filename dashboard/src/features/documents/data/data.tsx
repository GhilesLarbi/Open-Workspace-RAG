import {
  CheckCircle,
  XCircle,
  Globe,
  Tag,
  History,
  FileText
} from 'lucide-react'

export const languages = [
  {
    label: 'Arabic',
    value: 'AR',
    icon: Globe,
  },
  {
    label: 'French',
    value: 'FR',
    icon: Globe,
  },
  {
    label: 'English',
    value: 'EN',
    icon: Globe,
  },
]

export const approvalStatuses = [
  {
    label: 'Approved',
    value: 'true',
    icon: CheckCircle,
  },
  {
    label: 'Not Approved',
    value: 'false',
    icon: XCircle,
  },
]

export const jobActions = [
  {
    label: 'Crawled',
    value: 'CRAWLED',
    icon: History,
  },
  {
    label: 'Created',
    value: 'CREATED',
    icon: FileText,
  },
  {
    label: 'Updated',
    value: 'UPDATED',
    icon: History,
  },
  {
    label: 'Deleted',
    value: 'DELETED',
    icon: XCircle,
  },
]

export const tags = [
  {
    label: 'Blog',
    value: 'blog',
    icon: Tag,
  },
  {
    label: 'Product',
    value: 'product',
    icon: Tag,
  },
  {
    label: 'Legal',
    value: 'legal',
    icon: Tag,
  },
]
