import database, { campeonatosStoreName } from './database';

const CampeonatoService = {

  getCampeonatoById: async (campeonatoId) => {
    let db = await database.openDB();
    let campeonato = await db.get(campeonatosStoreName, parseInt(campeonatoId));
    if (campeonato) return campeonato;
    return null;
  },

  list: async () => {
    let db = await database.openDB();
    let campeonatos = await db.getAll(campeonatosStoreName);
    return campeonatos.sort((a, b) => {
      if (a.nome > b.nome) return 1;
      if (a.nome < b.nome) return -1;
      return 0;
    });
  },

  add: async (nome) => {
    let db = await database.openDB();
    return await db.put(campeonatosStoreName, { nome });
  }
}

export default CampeonatoService;