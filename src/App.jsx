import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomeLayout from './layouts/HomeLayout'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeLayout />}>
            
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
