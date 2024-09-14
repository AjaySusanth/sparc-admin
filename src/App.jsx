
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { AuthProvider } from "./libs/helper/AuthContext"
import Register from "./pages/Register"
const App = () => {

   return (
    <AuthProvider>
      <Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/register" element={<Register/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}
export default App
