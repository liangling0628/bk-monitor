export interface CategoryListItem {
  status: 'success' | 'error' | 'warning'
  name: string
  desc: string
}

export interface CategoryList {
  type: 'host' | 'custom'
  name: string
  children: CategoryListItem[]
}
