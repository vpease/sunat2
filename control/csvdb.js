var csvdb = require('node-csv-query').default;

class Db2 {
    constructor(pDatos,pModel,pSeparador){
        this.archivo = pDatos;        
        this.model = pModel;
        this.separador = pSeparador;        
    }
    async openDb() {
        this.db = await csvdb(this.archivo,{ delimiter: '|'});
    }
    async get(pDoc){
        if (!this.db) {            
            await this.openDb();
        }
        return this.db.findOne(
            { 
                RUC: pDoc
            }
        );
    }
    async closeDb(){
        delete(this.db);
    }
}
module.exports = Db2;