import { Route,Routes } from "react-router-dom"
import UserRoute from "./userRoute"

export default function appRoute() {
  return (
    <Routes>

            <Route  path='/*' element={<UserRoute/>} />
            {/* <Route  path='/admin/*' element={<AdminRoutes/>} /> */}
            

        </Routes>

  )
}
