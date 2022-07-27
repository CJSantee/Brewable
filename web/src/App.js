import "./App.css";

import { Routes, Route, Outlet } from "react-router-dom";

import AuthProvider from "./components/AuthProvider";
import Header from "./components/Header";
import AuthRoute from "./components/AuthRoute";
import Profile from "./components/Profile";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path='/profile'
            element={
              <AuthRoute>
                <Profile />
              </AuthRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
