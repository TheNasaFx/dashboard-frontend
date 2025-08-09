// Composable for Real Estate Debt API calls
export const useRealEstateDebtApi = () => {
  const baseURL = 'http://localhost:8080'

  // Get total real estate debt
  const getRealEstateDebtTotal = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/real-estate-debt/total`)
      const result = await response.json()
      
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Failed to fetch real estate debt total')
      }
    } catch (error) {
      console.error('Error fetching real estate debt total:', error)
      throw error
    }
  }

  // Get real estate debt distribution by district
  const getRealEstateDebtByDistrict = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/real-estate-debt/by-district`)
      const result = await response.json()
      
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Failed to fetch real estate debt by district')
      }
    } catch (error) {
      console.error('Error fetching real estate debt by district:', error)
      throw error
    }
  }

  return {
    getRealEstateDebtTotal,
    getRealEstateDebtByDistrict
  }
}
