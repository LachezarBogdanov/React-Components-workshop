import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import UserList from './components/UserList'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <>
		<Header />

		<main className="main">
			<ToastContainer />
			<UserList />

		</main>

		<Footer />
    </>
  )
}

export default App
