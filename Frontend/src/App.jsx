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
import CheckoutPage from './pages/Checkout/CheckoutPage';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import "./App.css";
import { Toaster } from 'react-hot-toast';
const MainLayout = ({ children }) => {
  return (
    <div className="main-layout-wrapper">
      <Header />
      <div className="main-layout-content">
        {children}
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#ffffff',
            color: '#2b3674',
            boxShadow: '0 10px 25px rgba(67, 24, 255, 0.08)',
            fontWeight: '550',
            fontSize: '14px',
            padding: '12px 20px',
            border: '1px solid rgba(67, 24, 255, 0.1)'
          },
          success: {
            iconTheme: { primary: '#4318ff', secondary: '#ffffff' }
          }
        }}
      />
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
        <Route path="/checkout" element={<CheckoutPage />} />
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
        <Route path="/about" element={
          <MainLayout>
            <About />
          </MainLayout>
        } />
        <Route path="/contact" element={
          <MainLayout>
            <Contact />
          </MainLayout>
        } />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;