import { Route,Routes } from "react-router-dom"
import UserRoute from "./userRoute"
import AdminRoute from "./adminRoute"

export default function appRoute() {
  return (
    <Routes>

            <Route  path='/*' element={<UserRoute/>} />
            <Route  path='/admin/*' element={<AdminRoute/>} />

        </Routes>

  )
}
