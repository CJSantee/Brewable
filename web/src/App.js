import "./App.css";

import { Routes, Route, Outlet } from "react-router-dom";

import Header from "./components/Header";
import AuthRoute from "./components/AuthRoute";
import Profile from "./components/Profile";
import PersistLogin from "./components/PersistLogin";
import PageNotFound from "./pages/ PageNotFound";

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route element={<PersistLogin />}>
          <Route element={<AuthRoute />}>
            <Route path='profile' element={<Profile />} />
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
