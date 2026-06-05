import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { PolicyDetails } from './pages/PolicyDetails';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { AdminPanel } from './pages/AdminPanel';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Header } from './components/Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
  },
  {
    path: '/politica/:id',
    element: <Layout><PolicyDetails /></Layout>,
  },
  {
    path: '/minha-area',
    element: <Layout><CitizenDashboard /></Layout>,
  },
  {
    path: '/admin',
    element: <Layout><AdminPanel /></Layout>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/cadastro',
    element: <Register />,
  },
  {
    path: '*',
    element: (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-4">Página não encontrada</p>
            <a href="/" className="text-[#003DA5] hover:underline">
              Voltar para a página inicial
            </a>
          </div>
        </div>
      </Layout>
    ),
  },
]);
