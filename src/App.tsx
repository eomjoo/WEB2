import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Home from './components/Home';
import HomeMain from './components/Main';
import HomeWishlist from './components/Wishlist';
import Search from './components/Search';
import HomePopular from './components/Popular';
import './App.css';

// Auth Guard for route protection
const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement | null => {
  const isAuthenticated = true; // Replace with actual authentication logic
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};

// Router configuration
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
        element: <HomeMain />,
      },
      {
        path: 'popular',
        element: <HomePopular />,
      },
      {
        path: 'wishlist',
        element: <HomeWishlist />,
      },
      {
        path: 'search',
        element: <Search />,
      },
    ],
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
],
{
  basename: '/WEB2',
}
);

// App component
function App() {
  return <RouterProvider router={router} />;
}

export default App;
