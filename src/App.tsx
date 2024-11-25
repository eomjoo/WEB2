import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Home from './components/Home';
import HomeMain from './components/Main';
import HomeWishlist from './components/Wishlist';
import Search from './components/Search';
import HomePopular from './components/Popular';
import './App.css';

// Optional: Auth Guard equivalent using a wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }): React.ReactElement | null => {

  return <>{children}</>; // Ensure valid JSX return type
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
