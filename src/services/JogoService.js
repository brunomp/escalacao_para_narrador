import database, { jogosStoreName } from './database';

const JogoService = {

  getById: async (jogoId) => {
    let db = await database.openDB();
    let jogo = await db.get(jogosStoreName, parseInt(jogoId));
    if (jogo) return jogo;
    return null;
  },

  list: async (campeonatoId) => {
    let db = await database.openDB();
    return await db.getAllFromIndex(jogosStoreName, 'campeonatoId', parseInt(campeonatoId));
  },

  save: async (Jogo) => {
    let db = await database.openDB();
    Jogo = JSON.parse(JSON.stringify(Jogo));
    if (Jogo.id === null || Jogo.id === 0) {
      delete Jogo.id;
    }
    return await db.put(jogosStoreName, Jogo);
  }
}

export default JogoService;