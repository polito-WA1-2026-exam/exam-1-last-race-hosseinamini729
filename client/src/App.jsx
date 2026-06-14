import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import NavigationBar from "./components/NavigationBar.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";

// Temporary placeholders for pages
const RankingPage = () => (
  <div>
    <h2>Ranking Page (Leaderboard)</h2>
  </div>
);
const NotFound = () => (
  <div>
    <h2>404 - Page Not Found</h2>
  </div>
);

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
      { path: "*", element: <NotFound /> },
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
