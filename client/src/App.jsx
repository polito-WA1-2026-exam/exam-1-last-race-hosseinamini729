import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

// Temporary placeholders for pages
const HomePage = () => (
  <div>
    <h2>Home Page (Instructions & Map)</h2>
  </div>
);
const LoginPage = () => (
  <div>
    <h2>Login Page</h2>
  </div>
);
const GamePage = () => (
  <div>
    <h2>Game Page (Planning & Execution)</h2>
  </div>
);
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
    <Container className="mt-4">
      <Outlet />
    </Container>
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
  return <RouterProvider router={router} />;
}

export default App;
