export default defineNuxtPlugin(() => {
  // Check authentication on route change
  const nuxtApp = useNuxtApp()
  
  nuxtApp.hook('app:mounted', () => {
    const router = useRouter()
    
    router.beforeEach((to, from, next) => {
      // Allow access to public routes
      const publicRoutes = ['/login', '/setup-2fa', '/']
      if (publicRoutes.includes(to.path)) {
        return next()
      }
      
      // Check if user is authenticated
      const token = localStorage.getItem('token')
      console.log('Auth Check - Token exists:', !!token, 'Route:', to.path)
      
      if (!token) {
        console.log('Redirecting to login...')
        return next('/login')
      }
      
      next()
    })
  })
})
