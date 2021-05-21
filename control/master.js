
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
                RazonSocial: "",
                Direcion: "",
                Ruc: "",
                CondDomicilio:"",                
                EstadoContr:"",
                TipoContr:"",
                SistemaEmisionComprobante: "",
                Departamento: "",
                Provincia: "",
                Distrito: "",
                Ubigeo: "",
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
                RazonSocial: "",
                Direcion: "",
                Ruc: "",
                CondDomicilio:"",                
                EstadoContr:"",
                TipoContr:"",
                SistemaEmisionComprobante: "",
                Departamento: "",
                Provincia: "",
                Distrito: "",
                Ubigeo: "",
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
            resp.Data.Ruc= row.RUC.toString();
            resp.Data.RazonSocial=row.NOMBRE;            
            resp.Data.Direcion =
                this.mostrar('',row.TIPOVIA)
                +' ' + this.mostrar('',row.NOMBREVIA)
                +' ' + this.mostrar('NRO. ',row.NUMERO)
                +' ' + this.mostrar('INT. ',row.INTERIOR)
                +' ' +this.mostrar('MZA. ',row.MANZANA) 
                +' ' + this.mostrar('LOTE. ',row.LOTE)
                +' ' + this.mostrar('',row.ZONA)
                +' ' + this.mostrar('',row.TIPOZONA)                 
                +' ' + this.mostrar('',row.DEPARTAMENTO)
                +' - ' + this.mostrar('',row.PROVINCIA)
                +' - ' + this.mostrar('',row.DISTRITO);
            resp.Data.EstadoContr = row.ESTADO;
            resp.Data.Departamento = (row.DEPARTAMENTO == null ? '-': row.DEPARTAMENTO.toUpperCase());
            resp.Data.Provincia = (row.PROVINCIA == null ? '-': row.PROVINCIA.toUpperCase());
            resp.Data.Distrito = (row.DISTRITO == null ? '-': row.DISTRITO.toUpperCase());
            resp.Data.Ubigeo = row.UBIGEO;
            resp.Data.CondDomicilio = row.CONDDOMI;
        } else {
            resp.Exito=false;
            resp.Mensaje='Ruc no existe';            
        }
        return Promise.resolve(resp);
    }
    mostrar(pTitulo,pValor){
        if (pValor != '-' && pValor != '----'){
            return pTitulo+ pValor.toUpperCase();
        } else{
            return '';
        }
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