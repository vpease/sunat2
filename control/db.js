const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

class Db {
    constructor(pDatos){
        this.archivo = pDatos;        
    }
    async openDb() {
        this.db = await sqlite.open({
            filename: './data/sunatv2.db',
            driver: sqlite3.Database,
            mode: sqlite3.OPEN_READONLY
          });
    }
    async get(pDoc){
        let sql = `SELECT * FROM consulta where RUC=?`;
        if (!this.db) {
            await this.openDb();
        }
        return this.db.get(sql, [pDoc]);
    }
    async closeDb(){
        delete(this.db);
    }
}
module.exports = Db;