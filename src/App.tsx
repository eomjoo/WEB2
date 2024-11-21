import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Home from './components/Home';
import HomeMain from './components/Main';
import HomeWishlist from './components/Wishlist';
import Search from './components/Search';
import HomePopular from './components/Popular';
import "./App.css"

// Optional: Auth Guard equivalent using a wrapper component
const ProtectedRoute = ({ children }: {
  children: React.ReactNode;
}) => {
  // Implement your auth logic here
  const isAuthenticated = true; // Replace with your auth check
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

// Define routes configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <HomeMain />
      },
      {
        path: 'popular',
        element: <HomePopular />
      },
      {
        path: 'wishlist',
        element: <HomeWishlist />
      },
      {
        path: 'search',
        element: <Search />
      }
    ]
  },
  {
    path: '/signin',
    element: <SignIn />
  }
]);

// In your App.js/tsx
function App() {
  return <RouterProvider router={router} />;
}

export default App;