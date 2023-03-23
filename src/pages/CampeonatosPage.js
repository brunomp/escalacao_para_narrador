import React, { useEffect, useRef, useState } from 'react';
import useBodyClass from '../hooks/body-class';
import './CampeonatosPage.css';
import Layout from '../Layout';
import CampeonatoService from '../services/CampeonatoService';
import { Link } from 'react-router-dom';

export default function CampeonatosPage() {

  const nome = useRef();
  const [campeonatos, setCampeonatos] = useState([]);

  useBodyClass("page-campeonatos");

  useEffect(() => {
    loadCampeonatos();
  }, []);

  async function loadCampeonatos() {
    setCampeonatos(await CampeonatoService.list());
  }

  async function addCampeonato(e) {
    e.preventDefault();
    await CampeonatoService.add(nome.current.value);
    await loadCampeonatos();
  }

  return (
    <Layout>
      <div className="flex-grow-1 d-flex flex-column">
        <h2 className="page-title text-center w-100 mb-5">Campeonatos</h2>
        <div className="text-uppercase w-50 m-auto mt-0">
          <form onSubmit={addCampeonato} className="row row-cols-auto g-3 align-items-end mb-5">
            <div className="col-9">
              <input 
                type="text" 
                ref={nome} 
                className="form-control text-uppercase" 
                placeholder="Nome do campeonato"
              />
            </div>
            <div className="col-3">
              <button
                className="btn btn-primary"
                type="submit"
              >Cadastrar</button>
            </div>
          </form>
          <ul className="campeonatos">
            {(campeonatos).map(campeonato => 
              <li key={campeonato.id}>
                <Link to={`/campeonato/${campeonato.id}`}>
                  {campeonato.nome}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
}