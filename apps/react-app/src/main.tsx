import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@schediochron/react-components';
import { Navbar } from './components/layout/navbar/Navbar';
import { HomePage } from './pages/HomePage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Layout nav={<Navbar />} footer="© 2024 Elias Mjøen">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
);
