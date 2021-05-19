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
        this.datos =  {
            Exito: true,
            Mensaje: "",
            Pila: '',
            CodigoHash:'',
            Data: {
                Ruc: "",
                RazonSocial: "",
                Direccion: "",
                CondDomicilio:"",                
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
        let ruc='';
        if (pConsulta.length==8) {
            ruc = '10'.concat(pConsulta);
            const mod = this.getMod11(ruc);
            ruc = ruc.concat(mod);
        } else {
            ruc = pConsulta;
        }
        var row = await this.bd.get(ruc);
        var resp = {
            Exito: true,
            Mensaje: "",
            Pila: '',
            CodigoHash:'',
            Data: {
                Ruc: "",
                RazonSocial: "",
                Direccion: "",
                CondDomicilio:"",                
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
        if (row){
            resp.Data.Ruc= row.RUC;
            resp.Data.RazonSocial=row.NOMBRE;
            resp.Data.Departamento = row.DEPARTAMENTO;
            resp.Data.Direccion = row.TIPOVIA +' '+ row.NOMBREVIA+ ' '+row.NUMERO +' '+ row.ZONA + ' ' + row.TIPOZONA;
            resp.Data.EstadoContr = row.ESTADO;
            resp.Data.Departamento = row.DEPARTAMENTO;            
            resp.Data.CondDomicilio = row.CONDDOMI;
        } else {
            resp.Exito=false;
            resp.Mensaje='Ruc no existe';            
        }
        return Promise.resolve(resp);
    }
    getMod11(datos){
        let modN = 11;
        var calc, i, checksum = 0, // running checksum total
        j = [5,4,3,2,7,6,5,4,3,2]; // toma el valor 1 o 2
        
        // Procesa cada digito comenzando por la derecha
        for (i = datos.length - 1; i >= 0; i -= 1) {
            // Extrae el siguiente digito y multiplica por 1 o 2 en digitos alternativos
            calc = Number(datos.charAt(i)) * j[i];
            checksum = checksum + calc;            
        }
        var mod = checksum % modN;        
        return (modN - mod);
    }
}
module.exports = Master;