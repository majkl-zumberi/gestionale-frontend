
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'articles', component: () => import('pages/Articles/ArticlesList.vue') },
      { path: 'measures', component: () => import('pages/MeasureUnits/MeasuresList.vue') },
      { path: 'categories', component: () => import('pages/Categories/CategoriesList.vue') },
      { path: 'customers', component: () => import('pages/Customers/CustomersList.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
