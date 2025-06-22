import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../app/layout/Layout';            // ⬅  новый import

import { HomePage }     from '../pages/HomePage/HomePage';
import { GeneratePage } from '../pages/GeneratePage/GeneratePage';
import { HistoryPage }  from '../pages/HistoryPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import "./styles/index.css"
export default function App() {
  return (

      <Routes>
   
        <Route element={<Layout />}>
          <Route path="/"         element={<HomePage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/history"  element={<HistoryPage />} />
          <Route path="*"         element={<NotFoundPage />} />
        </Route>
      </Routes>

  );
}
