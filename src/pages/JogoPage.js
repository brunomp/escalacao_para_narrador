import React, { useEffect, useRef, useState } from 'react';
import useBodyClass from '../hooks/body-class';
import Layout from '../Layout';
import { Link, useParams } from 'react-router-dom';
import TimeService from '../services/TimeService';
import JogoService from '../services/JogoService';
import JogadorService from '../services/JogadorService';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend'
import update from 'immutability-helper';
import { useDrag, useDrop } from 'react-dnd';
import './JogoPage.css';

export default function JogoPage() {

  const params = useParams();
  const [jogo, setJogo] = useState();
  const [mandante, setMandante] = useState();
  const [adversario, setAdversario] = useState();
  const [jogadoresMandante, setJogadoresMandante] = useState();
  const [jogadoresAdversario, setJogadoresAdversario] = useState();
  const [substituicaoMandante, setSubstituicaoMandante] = useState([]);
  const [substituicaoAdversario, setSubstituicaoAdversario] = useState([]);

  useBodyClass("page-jogo");

  useEffect(() => {
    loadJogo();
  }, []);

  useEffect(() => {
    if (jogo) {
      loadMandante();
      loadAdversario();
    }
  }, [jogo]);

  useEffect(() => {
    if (mandante) {
      loadJogadoresMandante();
    }
  }, [mandante]);

  useEffect(() => {
    if (adversario) {
      loadJogadoresAdversario(adversario.id);
    }
  }, [adversario]);

  useEffect(() => {
    if (Array.isArray(jogadoresMandante)) {
      salvaEscalacao(mandante.id, idsDosJogadores(jogadoresMandante));
    }
  }, [jogadoresMandante]);

  useEffect(() => {
    if (Array.isArray(jogadoresAdversario)) {
      salvaEscalacao(adversario.id, idsDosJogadores(jogadoresAdversario));
    }
  }, [jogadoresAdversario]);

  useEffect(() => {
    if (substituicaoMandante.length === 2) {
      substituiJogadorNoMandante();
    }
  }, [substituicaoMandante]);

  useEffect(() => {
    if (substituicaoAdversario.length === 2) {
      substituiJogadorNoAdversario();
    }
  }, [substituicaoAdversario]);

  async function loadJogo() {
    setJogo(await JogoService.getById(params.jogoId));
  }

  async function loadMandante() {
    setMandante(await TimeService.getById(jogo.mandanteId));
  }

  async function loadAdversario() {
    setAdversario(await TimeService.getById(jogo.adversarioId));
  }

  async function loadJogadoresMandante() {
    let jogadores = await JogadorService.list(mandante.id);
    if (Array.isArray(mandante.escalacao)) {
      jogadores = ordenaJogadoresPelaEscalacaoSalva(mandante.escalacao, jogadores);
    }
    setJogadoresMandante(jogadores);
  }

  async function loadJogadoresAdversario() {
    let jogadores = await JogadorService.list(adversario.id);
    if (Array.isArray(adversario.escalacao)) {
      jogadores = ordenaJogadoresPelaEscalacaoSalva(adversario.escalacao, jogadores);
    }
    setJogadoresAdversario(jogadores);
  }

  async function salvaEscalacao(timeId, escalacao) {
    await TimeService.salvaEscalacao(timeId, escalacao);
  }

  function ordenaJogadoresPelaEscalacaoSalva(escalacao, jogadores) {
    let ordenados = [];
    let naoOrdenados = [];
    jogadores.forEach(jogador => {
      let posicao = escalacao.indexOf(jogador.id);
      if (posicao > -1) {
        ordenados[posicao] = jogador;
      } else {
        naoOrdenados.push(jogador);
      }
    });
    ordenados = ordenados.filter(jogador => jogador !== null);
    return [...ordenados, ...naoOrdenados];
  }

  function idsDosJogadores(jogadores) {
    return jogadores.map(jgd => jgd.id);
  }

  function substituiJogadorNoMandante() {
    let jogadorA = substituicaoMandante[0];
    let jogadorB = substituicaoMandante[1];
    let idxJogadorA = jogadoresMandante.indexOf(jogadorA);
    let idxJogadorB = jogadoresMandante.indexOf(jogadorB);
    jogadorA.selecionado = false;
    jogadorB.selecionado = false;
    jogadoresMandante[idxJogadorA] = jogadorB;
    jogadoresMandante[idxJogadorB] = jogadorA;
    setJogadoresMandante([...jogadoresMandante]);
    setSubstituicaoMandante([]);
  }

  function substituiJogadorNoAdversario() {
    let jogadorA = substituicaoAdversario[0];
    let jogadorB = substituicaoAdversario[1];
    let idxJogadorA = jogadoresAdversario.indexOf(jogadorA);
    let idxJogadorB = jogadoresAdversario.indexOf(jogadorB);
    jogadorA.selecionado = false;
    jogadorB.selecionado = false;
    jogadoresAdversario[idxJogadorA] = jogadorB;
    jogadoresAdversario[idxJogadorB] = jogadorA;
    setJogadoresAdversario([...jogadoresAdversario]);
    setSubstituicaoAdversario([]);
  }

  return (
    <Layout>
      <div className="d-flex" style={{ columnGap: '20px' }}>
        <div className="time-container">
          <h2 className="text-center mb-4">
            <Link to={`/times/${mandante?.id}/jogadores`}>{mandante?.nome}</Link>
          </h2>
          <div className="jogadores">
            {(jogadoresMandante || []).map((jogador, index) =>
              <Card
                key={jogador.id}
                index={index}
                id={jogador.id}
                jogadorNome={jogador.nome}
                jogadorNumero={jogador.numero}
                onClick={e => {
                  jogador.selecionado = jogador.selecionado ? false : true;
                  if ( ! substituicaoMandante[0]) {
                    substituicaoMandante[0] = jogador;
                    setSubstituicaoMandante([...substituicaoMandante]);
                  } else {
                    substituicaoMandante[1] = jogador;
                    setSubstituicaoMandante([...substituicaoMandante]);
                  }
                  jogadoresMandante[index] = jogador;
                  setJogadoresMandante([...jogadoresMandante]);
                }}
                selecionado={jogador.selecionado}
                moveCard={(dragIndex, hoverIndex) => {
                  setJogadoresMandante((prevCards) =>
                    update(prevCards, {
                      $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevCards[dragIndex]],
                      ],
                    }),
                  )
                }}
              />
            )}
          </div>
        </div>
        <div className="time-container">
          <h2 className="text-center mb-4">
            <Link to={`/times/${adversario?.id}/jogadores`}>{adversario?.nome}</Link>
          </h2>
          <div className="jogadores">
            {(jogadoresAdversario || []).map((jogador, index) =>
              <Card
                key={jogador.id}
                index={index}
                id={jogador.id}
                jogadorNome={jogador.nome}
                jogadorNumero={jogador.numero}
                onClick={e => {
                  jogador.selecionado = jogador.selecionado ? false : true;
                  if ( ! substituicaoAdversario[0]) {
                    substituicaoAdversario[0] = jogador;
                    setSubstituicaoAdversario([...substituicaoAdversario]);
                  } else {
                    substituicaoAdversario[1] = jogador;
                    setSubstituicaoAdversario([...substituicaoAdversario]);
                  }
                  jogadoresAdversario[index] = jogador;
                  setJogadoresAdversario([...jogadoresAdversario]);
                }}
                selecionado={jogador.selecionado}
                moveCard={(dragIndex, hoverIndex) => {
                  setJogadoresAdversario((prevCards) =>
                    update(prevCards, {
                      $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevCards[dragIndex]],
                      ],
                    }),
                  )
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}


const ItemTypes = {
  CARD: 'card',
}
const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}
export const Card = ({ id, index, moveCard, jogadorNome, jogadorNumero, onClick, selecionado }) => {
  // const ref = useRef(null)
  // const [{ handlerId }, drop] = useDrop({
  //   accept: ItemTypes.CARD,
  //   collect(monitor) {
  //     return {
  //       handlerId: monitor.getHandlerId(),
  //     }
  //   },
  //   hover(item, monitor) {
  //     if (!ref.current) {
  //       return
  //     }
  //     const dragIndex = item.index
  //     const hoverIndex = index
  //     // Don't replace items with themselves
  //     if (dragIndex === hoverIndex) {
  //       return
  //     }
  //     // Determine rectangle on screen
  //     const hoverBoundingRect = ref.current?.getBoundingClientRect()
  //     // Get vertical middle
  //     const hoverMiddleY =
  //       (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
  //     // Determine mouse position
  //     const clientOffset = monitor.getClientOffset()
  //     // Get pixels to the top
  //     const hoverClientY = clientOffset.y - hoverBoundingRect.top
  //     // Only perform the move when the mouse has crossed half of the items height
  //     // When dragging downwards, only move when the cursor is below 50%
  //     // When dragging upwards, only move when the cursor is above 50%
  //     // Dragging downwards
  //     if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
  //       return
  //     }
  //     // Dragging upwards
  //     if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
  //       return
  //     }
  //     // Time to actually perform the action
  //     moveCard(dragIndex, hoverIndex)
  //     // Note: we're mutating the monitor item here!
  //     // Generally it's better to avoid mutations,
  //     // but it's good here for the sake of performance
  //     // to avoid expensive index searches.
  //     item.index = hoverIndex
  //   },
  // })
  // const [{ isDragging }, drag] = useDrag({
  //   type: ItemTypes.CARD,
  //   item: () => {
  //     return { id, index }
  //   },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  // })
  // const opacity = isDragging ? 0 : 1
  // drag(drop(ref))
  return (
    <div 
      // ref={ref} 
      // data-handler-id={handlerId}
      // style={{ opacity }} 
      className={`jogador-card ${selecionado ? 'selecionado' : ''}`} 
      onClick={onClick}
    >
      <span className="numero">{jogadorNumero}</span>
      <span className="nome">{jogadorNome}</span>
    </div>
  )
}
