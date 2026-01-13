import BooksPanel from './BooksPanel'
import UsersPanel from './UsersPanel'
import BookDataProvider from '../../providers/BookDataProvider'
import UserDataProvider from '../../providers/UserDataProvider'
import useLoanData from '../../hooks/useLoanData'

export default function AdminPanels() {
  const { reload } = useLoanData()

  return (
    <>
      <UserDataProvider onUserChange={reload}>
        <UsersPanel />
      </UserDataProvider>

      <BookDataProvider onBookChange={reload}>
        <BooksPanel />
      </BookDataProvider>
    </>
  )
}
