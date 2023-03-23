import React, { useEffect, useRef, useState } from 'react';
import useBodyClass from '../hooks/body-class';
import Layout from '../Layout';
import { Link, useParams } from 'react-router-dom';
import TimeService from '../services/TimeService';
import Jogador from '../models/Jogador';
import JogadorService from '../services/JogadorService';

export default function JogadoresPage() {

  const params = useParams();
  const jogadorNome = useRef();
  const jogadorNumero = useRef();
  const [time, setTime] = useState();
  const [jogadores, setJogadores] = useState([]);

  useBodyClass("page-jogadores");

  useEffect(() => {
    loadTime();
    loadJogadores();
  }, []);

  async function loadTime() {
    setTime(await TimeService.getById(params.timeId));
  }

  async function loadJogadores() {
    setJogadores(await JogadorService.list(params.timeId));
  }

  async function addJogador(event) {
    event.preventDefault();
    let jogador = {
      nome: jogadorNome.current.value,
      numero: jogadorNumero.current.value ? parseInt(jogadorNumero.current.value) : '',
      timeId: time.id,
    };
    await JogadorService.save(jogador);
    await loadJogadores();
    jogadorNome.current.value = "";
    jogadorNumero.current.value = "";
    jogadorNumero.current.focus();
  }

  async function saveJogador(jogador) {
    await JogadorService.save(jogador);
    await loadJogadores();
  }

  return (
    <Layout>
      <div className="flex-grow-1 d-flex flex-column">
        <h2 className="page-title text-center w-100 mb-5">Jogadores do {time?.nome}</h2>
        <div>
          <div className="text-uppercase w-50 m-auto mb-5">
            <form onSubmit={addJogador} className="row row-cols-auto g-3 align-items-end">
              <div className="col-2">
                <label className="form-label">Nº</label>
                <input
                  type="number"
                  className="form-control"
                  ref={jogadorNumero}
                />
              </div>
              <div className="col-8">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control text-uppercase"
                  ref={jogadorNome}
                />
              </div>
              <div className="col-2">
                <button
                  className="btn btn-primary"
                  type="submit"
                >Cadastrar</button>
              </div>
            </form>
          </div>
          <div className="text-uppercase w-50 m-auto">
            {(jogadores).map((jogador, index) =>
              <form
                key={jogador.id}
                onSubmit={e => {
                  e.preventDefault();
                  saveJogador(jogador);
                }}
                className="row row-cols-auto g-3 align-items-end mb-3"
              >
                <div className="col-2">
                  <input
                    type="number"
                    value={jogador.numero}
                    onChange={e => {
                      jogador.editado = true;
                      jogador.numero = e.target.value ? parseInt(e.target.value) : '';
                      jogadores[index] = jogador;
                      setJogadores([...jogadores]);
                    }}
                    className="form-control"
                  />
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    value={jogador.nome}
                    onChange={e => {
                      jogador.editado = true;
                      jogador.nome = e.target.value;
                      jogadores[index] = jogador;
                      setJogadores([...jogadores]);
                    }}
                  />
                </div>
                <div className="col-2">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={jogador.editado !== true}
                  >Salvar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}