import { useContext } from 'react'
import { BookDataContext } from '../context/BookDataContext'

export default function useBookData() {
  const context = useContext(BookDataContext)
  if (!context) {
    throw new Error('useBookData must be used within BookDataProvider')
  }
  return context
}
