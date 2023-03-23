import database, { timesStoreName } from './database';

const TimeService = {

  getById: async (timeId) => {
    let db = await database.openDB();
    let time = await db.get(timesStoreName, parseInt(timeId));
    if (time) return time;
    return null;
  },

  list: async (campeoantoId) => {
    let db = await database.openDB();
    let times = await db.getAllFromIndex(timesStoreName, 'campeonatoId', parseInt(campeoantoId));
    return times.sort((a, b) => {
      if (a.nome > b.nome) return 1;
      if (a.nome < b.nome) return -1;
      return 0;
    });
  },

  save: async (Time) => {
    let db = await database.openDB();
    Time = JSON.parse(JSON.stringify(Time));
    if (Time.id === null || Time.id === 0) {
      delete Time.id;
    }
    return await db.put(timesStoreName, Time);
  },

  salvaEscalacao: async (timeId, escalacao) => {
    let db = await database.openDB();
    let time = await TimeService.getById(timeId);
    time.escalacao = [...escalacao];
    return await db.put(timesStoreName, time);
  }
}

export default TimeService;