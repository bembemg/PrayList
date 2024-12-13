import './App.css'
import PrivateRoute from './components/PrivateRoute'
import List from './components/list/list.jsx'
import Login from './components/login/login.jsx'
import Register from './components/register/register.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/list',
    element: (
    <PrivateRoute>
      <List />
    </PrivateRoute>
    )
  }
]);

function App() {

  return (
    <div>
      <RouterProvider router={ router } />
    </div>
  )
}

export default App
