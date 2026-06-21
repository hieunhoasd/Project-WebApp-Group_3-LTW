import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />

        {/* 2. ĐẶT TOAST CONTAINER Ở ĐÂY ĐỂ DÙNG CHUNG TOÀN APP */}
        <ToastContainer
          position="bottom-right" /* Nằm ở góc dưới bên phải */
          autoClose={3000} /* Tự tắt sau 3 giây */
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" /* Có thể đổi thành "colored" hoặc "dark" */
        />

      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
);