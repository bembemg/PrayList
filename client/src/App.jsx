import './App.css'
import List from './components/list/list.jsx'
import Login from './components/login/login.jsx'
import Register from './components/register/register.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div><Login /></div>
  },
  {
    path: '/register',
    element: <div><Register /></div>
  },
  {
    path: '/list',
    element: <div><List /></div>
  }
])

function App() {

  return (
    <div>
      <RouterProvider router={ router } />
    </div>
  )
}

export default App
