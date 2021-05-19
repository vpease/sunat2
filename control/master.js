const { RSA_NO_PADDING } = require('constants');
const crawler = require('./crawler');
const Db = require('./db');

var homeUrl = 'https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/';
var postUrl = 'jcrS00Alias';
var model = ["RUC","NOMBRE O RAZÓN SOCIAL","ESTADO DEL CONTRIBUYENTE","CONDICIÓN DE DOMICILIO","UBIGEO","TIPO DE VÍA","NOMBRE DE VÍA","CÓDIGO DE ZONA","TIPO DE ZONA","NÚMERO","INTERIOR","LOTE","DEPARTAMENTO","MANZANA","KILÓMETRO"];
var separador ='|';

class Master {
    constructor(pDatos, pModel, pSeparador) {
        this.archivo =pDatos;
        this.modelo = pModel;
        this.separador= pSeparador;

        this.datos = {
            Exito: true,
            Mensaje: "",
            Pila: '',
            CodigoHash:'',
            Data: {
                RazonSocial: "",
                Direccion: "",
                Ruc: "",
                EstadoContr:"",
                TipoContr:"",
                SistemaEmisionComprobante: "",
                Departamento: "",
                Provincia: "",
                Distrito: "",
                Actividades: [
                    {
                        id:0,
                        CIIU:'',
                        actividad:''
                    }
                ]
            }
        };        
    }     
    async consultar(pConsulta) {
        this.bd = new Db(this.archivo);
        console.log("Inicio: " + pConsulta + ' ' + new Date());
        var row = await this.bd.get(pConsulta);
        this.datos.Data.Ruc= row.RUC;
        this.datos.Data.RazonSocial=row.NOMBRE;
        this.datos.Data.Departamento = row.DEPARTAMENTO;
        this.datos.Data.
        console.log(this.datos);
        return Promise.resolve(this.datos);
    }
}
module.exports = Master;