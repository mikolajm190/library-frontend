import { useContext } from 'react'
import { UserDataContext } from '../context/UserDataContext'

export default function useUserData() {
  const context = useContext(UserDataContext)
  if (!context) {
    throw new Error('useUserData must be used within UserDataProvider')
  }
  return context
}
