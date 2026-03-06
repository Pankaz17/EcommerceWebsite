import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add token to requests if available
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Only log if user was authenticated (had a token)
      if (localStorage.getItem('token')) {
        console.warn('Unauthorized: Token may be expired or invalid')
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
      }
    }

    // Handle other errors
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
    }

    // Return error for caller to handle
    return Promise.reject(error)
  }
)

export default api

