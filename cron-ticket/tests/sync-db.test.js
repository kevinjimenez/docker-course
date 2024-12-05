const { syncDB } = require("../task/sync-db")

describe('Pruebas en Sync-DB', () => {
  test('debe de ejecutar el preoceso 2 veces', () => {

    syncDB();
    const times = syncDB();

    expect(times).toBe(2)
   })
})