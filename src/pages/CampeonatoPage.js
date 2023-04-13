import React, { useEffect, useRef, useState } from 'react';
import useBodyClass from '../hooks/body-class';
import Layout from '../Layout';
import CampeonatoService from '../services/CampeonatoService';
import { Link, useParams } from 'react-router-dom';
import TimeService from '../services/TimeService';
import Time from '../models/Time';
import Jogo from '../models/Jogo';
import JogoService from '../services/JogoService';

export default function CampeonatoPage() {

  const params = useParams();
  const novoTime = useRef();
  const [campeonato, setCampeonato] = useState();
  const [times, setTimes] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [novoJogo, setNovoJogo] = useState({...Jogo, campeonatoId: parseInt(params.campeonatoId)});

  useBodyClass("page-campeonato");

  useEffect(() => {
    loadCampeonato();
    loadTimes();
    loadJogos();
  }, []);

  useEffect(() => {
    if (times.length > 0) {
      novoJogo.mandanteId = times[0].id;
      novoJogo.adversarioId = times[0].id;
      setNovoJogo({...novoJogo});
    }
  }, [times]);

  async function loadCampeonato() {
    setCampeonato(await CampeonatoService.getCampeonatoById(params.campeonatoId));
  }

  async function loadTimes() {
    setTimes(await TimeService.list(params.campeonatoId));
  }

  async function loadJogos() {
    setJogos(await JogoService.list(params.campeonatoId));
  }

  async function addTime(e) {
    e.preventDefault();
    if (novoTime.current.value === "") {
      return;
    }
    let time = JSON.parse(JSON.stringify(Time));
    time.nome = novoTime.current.value;
    time.campeonatoId = campeonato.id;
    await TimeService.save(time);
    await loadTimes();
    novoTime.current.value = "";
    novoTime.current.focus();
  }

  async function addJogo() {
    await JogoService.save(novoJogo);
    await loadJogos();
  }

  return (
    <Layout>
      <div className="">
        <h2 className="w-100 text-center mb-5">{campeonato?.nome}</h2>
        <div className="row">
          <div className="col-5">
            <h3>Times</h3>
            <form onSubmit={addTime} className="row align-items-end">
              <div className="col-8">
                <input 
                  type="text" 
                  ref={novoTime}
                  className="form-control text-uppercase"
                  placeholder="Nome do time"
                />
              </div>
              <div className="col-4">
                <button
                  className="btn btn-primary"
                  type="submit"
                >Adicionar</button>
              </div>
            </form>
            <ul className="mt-5">
              {(times).map(time =>
                <li key={time.id} className="text-uppercase">
                  <Link to={`/times/${time.id}`}>
                    {time.nome}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="col-7">
            <h3>Jogos</h3>
            <form onSubmit={addTime} className="row align-items-end">
              <div className="col-4">
                <select 
                  className="form-select"
                  onChange={e => {
                    novoJogo.mandanteId = parseInt(e.target.value);
                    setNovoJogo({ ...novoJogo });
                  }}>
                  {(times).map(time =>
                    <option key={time.id} value={time.id}>
                      {time.nome}
                    </option>
                  )}
                </select>
              </div>
              <div className="col-1 text-center">x</div>
              <div className="col-4">
                <select 
                  className="form-select"
                  onChange={e => {
                    novoJogo.adversarioId = parseInt(e.target.value);
                    setNovoJogo({ ...novoJogo });
                  }}>
                  {(times).map(time =>
                    <option key={time.id} value={time.id}>
                      {time.nome}
                    </option>
                  )}
                </select>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-primary"
                  onClick={addJogo}
                >Adicionar</button>
              </div>
            </form>
            <ul className="mt-5">
              {(jogos).map(jogo =>
                <li key={jogo.id}>
                  <Link to={`/jogos/${jogo.id}`}>
                    {times.find(time => time.id === jogo.mandanteId).nome} x {times.find(time => time.id === jogo.adversarioId).nome}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}