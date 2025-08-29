import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    console.log('Auth check - Token exists:', !!token)
    
    if (!token) {
      console.log('No token found, redirecting to login')
      router.push('/login')
      return false
    }
    
    return true
  }

  const requireAuth = () => {
    if (process.client) {
      return checkAuth()
    }
    return true
  }

  return {
    checkAuth,
    requireAuth
  }
}
