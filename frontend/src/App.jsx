import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SpecificationPage from './pages/SpecificationPage';
import AgilePage from './pages/AgilePage';
import DesignPage from './pages/DesignPage';
import ArchitecturePage from './pages/ArchitecturePage';
import ProjectsPage from './pages/ProjectsPage';
import TemplateLearningPage from './pages/TemplateLearningPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/templates" element={<TemplateLearningPage />} />
        <Route path="/specification" element={<SpecificationPage />} />
        <Route path="/agile" element={<AgilePage />} />
        <Route path="/design" element={<DesignPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
