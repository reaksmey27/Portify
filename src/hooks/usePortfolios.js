import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  createPortfolio,
  deletePortfolio,
  getPortfolios,
  updatePortfolio,
} from '../services/portfolioService'

export function usePortfolios() {
  const { user } = useAuth()
  const userId = user?.id
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPortfolios = useCallback(async () => {
    if (!userId) {
      setPortfolios([])
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')
    try {
      setPortfolios(await getPortfolios())
    } catch (err) {
      setError(err.message || 'Failed to load portfolios.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchPortfolios()
  }, [fetchPortfolios])

  const addPortfolio = async (portfolioData) => {
    if (!userId) throw new Error('You must be signed in to create a portfolio.')
    try {
      const portfolio = await createPortfolio({ ...portfolioData, userId })
      setPortfolios(current => [portfolio, ...current])
      setError('')
      return portfolio
    } catch (err) {
      setError(err.message || 'Failed to create portfolio.')
      throw err
    }
  }

  const editPortfolio = async (id, updates) => {
    try {
      const portfolio = await updatePortfolio(id, updates)
      setPortfolios(current => current.map(item => item.id === id ? portfolio : item))
      setError('')
      return portfolio
    } catch (err) {
      setError(err.message || 'Failed to update portfolio.')
      throw err
    }
  }

  const removePortfolio = async (id) => {
    try {
      await deletePortfolio(id)
      setPortfolios(current => current.filter(item => item.id !== id))
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to delete portfolio.')
      throw err
    }
  }

  return {
    portfolios,
    loading,
    error,
    addPortfolio,
    editPortfolio,
    removePortfolio,
    refreshPortfolios: fetchPortfolios,
  }
}
