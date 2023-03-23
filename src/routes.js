import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CampeonatoPage from './pages/CampeonatoPage';
import CampeonatosPage from './pages/CampeonatosPage';
import JogadoresPage from './pages/JogadoresPage';
import JogoPage from './pages/JogoPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/campeonatos" element={<CampeonatosPage />} />
      <Route path="/campeonato/:campeonatoId" element={<CampeonatoPage />} />
      <Route path="/times/:timeId/jogadores" element={<JogadoresPage />} />
      <Route path="/jogos/:jogoId" element={<JogoPage />} />
      <Route path="/" exact={true} element={<Navigate to="/campeonatos" replace />} />
    </Routes>
  );
}