import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/header";
import Footer from "./components/Footer/footer";
import Home from "./pages/Home/home";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";
import CartPage from './pages/CartPage/CartPage';
import UserProfile from "./pages/UserProfile/UserProfile";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";
import CategoryPage from "./pages/Category/CategoryPage";
import AdminPage from "./pages/Admin/AdminPage";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound/NotFound";

import "./App.css";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <MainLayout>
          <Home />
        </MainLayout>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/user-profile" element={
        <MainLayout>
          <UserProfile />
        </MainLayout>
      } />

      <Route path="/admin" element={
        <AdminRoute>
          <AdminPage />
        </AdminRoute>
      } />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;