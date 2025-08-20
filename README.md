# 🛒 Aldo's Fake Store

A modern, responsive e-commerce web application built with React, featuring a complete shopping experience with product browsing, cart management, and checkout functionality.

![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.0.4-green.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.7-purple.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

### 🏪 Core E-commerce Functionality

- **Product Catalog** - Browse and search through a wide range of products
- **Product Details** - View detailed information, images, and specifications
- **Shopping Cart** - Add, remove, and manage items with persistent storage
- **Checkout Process** - Complete purchase flow with form validation
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### 🔧 Advanced Features

- **Product Management** - Add, edit, and delete products (admin functionality)
- **Category Filtering** - Filter products by categories
- **Search Functionality** - Real-time product search
- **Local Storage** - Cart persistence across browser sessions
- **Toast Notifications** - User feedback for actions
- **Loading States** - Smooth UX with loading indicators

### 🎨 UI/UX Features

- **Modern Design** - Clean, professional interface with consistent theming
- **Dark Blue Theme** - Cohesive color scheme throughout the application
- **Interactive Elements** - Hover effects and smooth transitions
- **Mobile-First** - Responsive design that works on all screen sizes

## 🚀 Demo

The application uses the [Fake Store API](https://fakestoreapi.com/) to provide realistic product data for demonstration purposes.

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Aldonvacriates/aldos-fake-store.git
   cd aldos-fake-store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Built With

### Frontend Framework

- **[React 19.1.0](https://reactjs.org/)** - Modern JavaScript library for building user interfaces
- **[Vite 7.0.4](https://vitejs.dev/)** - Fast build tool and development server

### UI Framework & Styling

- **[React Bootstrap 2.10.10](https://react-bootstrap.github.io/)** - Bootstrap components for React
- **[Bootstrap 5.3.7](https://getbootstrap.com/)** - CSS framework for responsive design

### Routing & Navigation

- **[React Router DOM 7.7.1](https://reactrouter.com/)** - Declarative routing for React applications

### HTTP Client & API

- **[Axios 1.11.0](https://axios-http.com/)** - Promise-based HTTP client
- **[Fake Store API](https://fakestoreapi.com/)** - RESTful API for product data

### Notifications

- **[React Toastify 11.0.5](https://fkhadra.github.io/react-toastify/)** - Toast notifications for React

## 📁 Project Structure

```
src/
├── api/                    # API service functions
│   └── api.js             # Axios API calls
├── components/            # Reusable UI components
│   ├── AddProduct.jsx     # Product creation form
│   ├── Checkout.jsx       # Checkout process
│   ├── EditProduct.jsx    # Product editing form
│   ├── Loader.jsx         # Loading spinner
│   ├── NavigationBar.jsx  # Main navigation
│   └── ProductForm.jsx    # Shared product form
├── context/               # React Context providers
│   └── CartContext.jsx    # Shopping cart state management
├── hooks/                 # Custom React hooks
│   ├── index.js          # Hook exports
│   ├── useApi.js         # API call management
│   ├── useCart.js        # Cart operations
│   ├── useDebounce.js    # Debouncing utilities
│   └── useLocalStorage.js # LocalStorage management
├── pages/                 # Main application pages
│   ├── CartPage.jsx      # Shopping cart view
│   ├── Home.jsx          # Landing page
│   ├── ProductDetails.jsx # Individual product view
│   └── ProductList.jsx   # Product catalog
├── App.jsx               # Main application component
└── main.jsx             # Application entry point
```

## 🔄 Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build the project for production         |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint for code quality checks       |

## 🌟 Key Components

### Cart Management

- **Persistent Storage** - Cart data saved to localStorage
- **Real-time Updates** - Cart count updates across all components
- **Quantity Management** - Add, remove, and update item quantities

### Product Operations

- **CRUD Operations** - Full create, read, update, delete functionality
- **Form Validation** - Client-side validation for all forms
- **Error Handling** - Graceful error handling with user feedback

### Responsive Design

- **Mobile-First** - Optimized for mobile devices
- **Flexible Grid** - Bootstrap grid system for layouts
- **Touch-Friendly** - Appropriate touch targets for mobile users

## 🎯 Usage Examples

### Adding Items to Cart

```javascript
import { useCart } from "../hooks";

function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(`Added ${product.title} to cart`);
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

### Using Custom Hooks

```javascript
import { useLocalStorage, useDebounce } from "../hooks";

function SearchComponent() {
  const [query, setQuery] = useLocalStorage("searchQuery", "");
  const debouncedQuery = useDebounce(query, 300);

  // Search logic here...
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for any environment-specific configurations:

```env
VITE_API_BASE_URL=https://fakestoreapi.com
```

### Build Configuration

The project uses Vite for bundling. Configuration can be modified in `vite.config.js`.

## 🐛 Known Issues & Limitations

- **API Limitations** - Fake Store API doesn't persist changes (add/edit/delete operations are simulated)
- **No Authentication** - Currently no user authentication system
- **No Payment Processing** - Checkout is for demonstration purposes only

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aldo** - [Aldonvacriates](https://github.com/Aldonvacriates)

## 🙏 Acknowledgments

- [Fake Store API](https://fakestoreapi.com/) for providing the product data
- [React Bootstrap](https://react-bootstrap.github.io/) for the UI components
- [Vite](https://vitejs.dev/) for the amazing build tool

---

**Made with ❤️ by Aldo**
