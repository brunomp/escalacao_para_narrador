import database, { jogadoresStoreName } from './database';
import JogadorModel from '../models/Jogador';

const JogadorService = {

  getById: async (jogadorId) => {
    let db = await database.openDB();
    let jogador = await db.get(jogadoresStoreName, parseInt(jogadorId));
    if (jogador) return jogador;
    return null;
  },

  list: async (timeId) => {
    let db = await database.openDB();
    let jogadores = await db.getAllFromIndex(jogadoresStoreName, 'timeId', parseInt(timeId));
    return jogadores.sort((a, b) => {
      if (a.numero > b.numero) return 1;
      if (a.numero < b.numero) return -1;
      return 0;
    });
  },

  save: async (jogador) => {
    let db = await database.openDB();
    let newJogador = JSON.parse(JSON.stringify(JogadorModel));
    newJogador.id = jogador.id;
    if ( ! newJogador.id) {
      delete newJogador.id;
    }
    newJogador.timeId = parseInt(jogador.timeId);
    newJogador.nome = jogador.nome;
    newJogador.numero = jogador.numero ? parseInt(jogador.numero) : '';
    newJogador.posicao = jogador.posicao ?? '';
    return await db.put(jogadoresStoreName, newJogador);
  }
}

export default JogadorService;