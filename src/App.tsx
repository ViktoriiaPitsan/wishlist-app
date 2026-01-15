import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WishesProvider } from './context/WishesContext';
import { HomePage } from './pages/HomePage/HomePage';
import { WishPage } from './pages/WishPage/WishPage';

function App() {
  return (
    <WishesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wish/:id" element={<WishPage />} />
        </Routes>
      </Router>
    </WishesProvider>
  );
}

export default App;