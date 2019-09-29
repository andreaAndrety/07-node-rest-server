//======================
//puerto 
//======================
process.env.PORT = process.env.PORT || 3000;



//======================
//entorno
//======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//======================
//vencimiento del token
//======================
// 60 segundo
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//======================
//SEED autentication
//======================
process.env.SEMILLA = process.env.SEMILLA || 'este-es-el-seed-desarrollo';
//para que esto funcione en produccion se declara una variable en 
//heroku con la informacion 

//======================
//bases de datos
//======================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
    //  'mongodb+srv://strider:dPfXAvq0cVIm497r@cluster0-r8bkc.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.URL_DB = urlDB;