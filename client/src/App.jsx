import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import NavigationBar from "./components/NavigationBar.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";
import RankingPage from "./pages/RankingPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const AppLayout = () => {
  return (
    <>
      <NavigationBar />
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/game", element: <GamePage /> },
      { path: "/ranking", element: <RankingPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />;
    </AuthProvider>
  );
}

export default App;
