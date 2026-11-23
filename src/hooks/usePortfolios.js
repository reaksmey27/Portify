import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import {
  createPortfolio,
  deletePortfolio,
  getPortfolios,
  updatePortfolio,
} from '../services/portfolioService'

const emptySnapshot = { userId: null, portfolios: [], error: '' }

export function usePortfolios() {
  const { user } = useAuth()
  const userId = user?.id
  const [snapshot, setSnapshot] = useState(emptySnapshot)
  const [refreshKey, setRefreshKey] = useState(0)
  const loading = Boolean(userId) && snapshot.userId !== userId
  const portfolios = snapshot.userId === userId ? snapshot.portfolios : []
  const error = snapshot.userId === userId ? snapshot.error : ''

  useEffect(() => {
    if (!userId) return undefined
    let cancelled = false
    getPortfolios()
      .then(data => {
        if (!cancelled) setSnapshot({ userId, portfolios: data, error: '' })
      })
      .catch(err => {
        if (!cancelled) setSnapshot({ userId, portfolios: [], error: err.message || 'Failed to load portfolios.' })
      })
    return () => { cancelled = true }
  }, [userId, refreshKey])

  const addPortfolio = async (portfolioData) => {
    if (!userId) throw new Error('You must be signed in to create a portfolio.')
    try {
      const portfolio = await createPortfolio({ ...portfolioData, userId })
      setSnapshot(current => current.userId === userId
        ? { ...current, portfolios: [portfolio, ...current.portfolios], error: '' }
        : current)
      return portfolio
    } catch (err) {
      setSnapshot(current => current.userId === userId ? { ...current, error: err.message || 'Failed to create portfolio.' } : current)
      throw err
    }
  }

  const editPortfolio = async (id, updates) => {
    try {
      const portfolio = await updatePortfolio(id, updates)
      setSnapshot(current => current.userId === userId
        ? { ...current, portfolios: current.portfolios.map(item => item.id === id ? portfolio : item), error: '' }
        : current)
      return portfolio
    } catch (err) {
      setSnapshot(current => current.userId === userId ? { ...current, error: err.message || 'Failed to update portfolio.' } : current)
      throw err
    }
  }

  const removePortfolio = async (id) => {
    try {
      await deletePortfolio(id)
      setSnapshot(current => current.userId === userId
        ? { ...current, portfolios: current.portfolios.filter(item => item.id !== id), error: '' }
        : current)
    } catch (err) {
      setSnapshot(current => current.userId === userId ? { ...current, error: err.message || 'Failed to delete portfolio.' } : current)
      throw err
    }
  }

  const refreshPortfolios = useCallback(() => {
    if (!userId) return
    setSnapshot(current => current.userId === userId ? { ...current, userId: null } : current)
    setRefreshKey(current => current + 1)
  }, [userId])

  return { portfolios, loading, error, addPortfolio, editPortfolio, removePortfolio, refreshPortfolios }
}
