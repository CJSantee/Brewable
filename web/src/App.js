import { Routes, Route, Outlet } from "react-router-dom";

import Header from "./components/Header";
import AuthRoute from "./components/AuthRoute";
import PersistLogin from "./components/PersistLogin";
import PageNotFound from "./pages/PageNotFound";
import New from "./pages/New";
import NewBeans from "./pages/NewBeans";
import AllBeans from "./pages/AllBeans";
import Beans from "./pages/Beans";
import User from "./pages/User";
import Post from "./pages/Post";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<PersistLogin />}>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/:username/*' element={<User />} />
          <Route element={<AuthRoute />}>
            <Route path='beans/*' element={<BeansRoutes />} />
            <Route path='post/:uuid' element={<Post />} />
          </Route>
          <Route element={<AuthRoute roles={["admin"]} />}>
            <Route path='/admin' element={<Admin />} />
          </Route>
        </Route>
        <Route path='*' element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div className='d-flex vh-100 flex-column'>
      <Header />
      <Outlet />
    </div>
  );
}

function BeansRoutes() {
  return (
    <Routes>
      <Route path='/' element={<AllBeans />} />
      <Route path='/:beansId' element={<Beans />} />
    </Routes>
  );
}

function NewRoutes() {
  return (
    <Routes>
      <Route path='/' element={<New />} />
      <Route path='/beans' element={<NewBeans />} />
    </Routes>
  );
}
