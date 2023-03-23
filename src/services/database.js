import { openDB, unwrap } from 'idb';

const campeonatosStoreName = 'campeonatos';
const timesStoreName = 'times';
const jogadoresStoreName = 'jogadores';
const jogosStoreName = 'jogos';

const database = {
    openDB: async () => {
        const db = await openDB('multiesporte_escalacoes', 3, {
            upgrade(db, oldVersion, newVersion, transaction, event) {

                // Campeonatos
                let campeonatosStore;
                if (db.objectStoreNames.contains(campeonatosStoreName)) {
                    campeonatosStore = transaction.objectStore(campeonatosStoreName);
                } else {
                    campeonatosStore = db.createObjectStore(campeonatosStoreName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                }

                // Times
                let timesStore;
                if (db.objectStoreNames.contains(timesStoreName)) {
                    timesStore = transaction.objectStore(timesStoreName);
                } else {
                    timesStore = db.createObjectStore(timesStoreName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                }
                if ( ! timesStore.indexNames.contains('campeonatoId')) {
                    timesStore.createIndex("campeonatoId", "campeonatoId", { unique: false });
                }

                // Jogadores
                let jogadoresStore;
                if (db.objectStoreNames.contains(jogadoresStoreName)) {
                    jogadoresStore = transaction.objectStore(jogadoresStoreName);
                } else {
                    jogadoresStore = db.createObjectStore(jogadoresStoreName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                }
                if ( ! jogadoresStore.indexNames.contains('timeId')) {
                    jogadoresStore.createIndex("timeId", "timeId", { unique: false });
                }

                // Jogadores
                let jogosStore;
                if (db.objectStoreNames.contains(jogosStoreName)) {
                    jogosStore = transaction.objectStore(jogosStoreName);
                } else {
                    jogosStore = db.createObjectStore(jogosStoreName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                }
                if ( ! jogosStore.indexNames.contains('campeonatoId')) {
                    jogosStore.createIndex("campeonatoId", "campeonatoId", { unique: false });
                }

                // // Manutenções
                // let manutencoesStore;
                // if (db.objectStoreNames.contains(manutencoesStoreName)) {
                //     manutencoesStore = transaction.objectStore(manutencoesStoreName);
                // } else {
                //     manutencoesStore = db.createObjectStore(manutencoesStoreName, {
                //         keyPath: 'uuid',
                //         autoIncrement: false
                //     });
                // }
                // if ( ! manutencoesStore.indexNames.contains('_offline_sync')) {
                //     manutencoesStore.createIndex("_offline_sync", "_offline_sync", { unique: false });
                // }

                // // veiculos
                // if ( ! db.objectStoreNames.contains(veiculosStoreName)) {
                //     let veiculosStore = db.createObjectStore(veiculosStoreName, {
                //         keyPath: 'id',
                //         autoIncrement: false
                //     });
                //     veiculosStore.createIndex("id", "id", { unique: false });
                // }

                // // produtos
                // if ( ! db.objectStoreNames.contains(produtosStoreName)) {
                //     let produtosStore = db.createObjectStore(produtosStoreName, {
                //         keyPath: 'id',
                //         autoIncrement: false
                //     });
                //     produtosStore.createIndex("id", "id", { unique: false });
                // }

                // // endereços
                // if ( ! db.objectStoreNames.contains(enderecosStoreName)) {
                //     let enderecosStore = db.createObjectStore(enderecosStoreName, {
                //         keyPath: 'id',
                //         autoIncrement: false
                //     });
                //     enderecosStore.createIndex("id", "id", { unique: false });
                // }
            }
        });
        return db;
    }
}

export {
    database as default,
    campeonatosStoreName,
    timesStoreName,
    jogadoresStoreName,
    jogosStoreName
}