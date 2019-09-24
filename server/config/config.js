//puerto 

process.env.PORT = process.env.PORT || 3000;

//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://strider:dPfXAvq0cVIm497r@cluster0-r8bkc.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.URL_DB = urlDB;