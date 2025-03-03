import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import UserList from './components/UserList'

function App() {

  return (
    <>
		<Header />

		{/* <!-- Main component  --> */}
		<main className="main">
			{/* <!-- Section component  --> */}
			<UserList />

			{/* <!-- User details component  --> */}
			


			{/* <!-- Create/Edit Form component  --> */}
			


			{/* <!-- Delete user component  --> */}
			

		</main>

		<Footer />
    </>
  )
}

export default App
