import { Routes, Route, Outlet } from "react-router-dom";

import Header from "./components/Header";
import AuthRoute from "./components/AuthRoute";
import Profile from "./pages/Profile";
import PersistLogin from "./components/PersistLogin";
import PageNotFound from "./pages/ PageNotFound";
import New from "./pages/New";
import NewBeans from "./pages/NewBeans";
import AllBeans from "./pages/AllBeans";
import Beans from "./pages/Beans";

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route element={<PersistLogin />}>
          <Route element={<AuthRoute />}>
            <Route path='beans/*' element={<BeansRoutes />} />
            <Route path='profile' element={<Profile />} />
            <Route path='new/*' element={<NewRoutes />} />
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
