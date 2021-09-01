const exp = require('constants');
const express = require('express');
const handlebars = require('express-handlebars');
const fs = require("fs");
const App = express();
const FILE_PRODUCTOS = "productos.txt";
const productos = require('./rutas/productos.route');

App.use(express.json());
App.use(express.urlencoded({ extended: false }));

const Port = 3200;

App.engine('hbs', handlebars({
    extname: ".hbs",
    defaultLayout: 'index.hbs',
    layoutsDir:__dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
}))

App.set("views", "./views");
App.set("view engine", "hbs");
App.use(express.static("public"));


App.use('/api', productos);
// =========== LEVANTAR SERVIDOR==========
App.listen(Port, () => console.log(`Servidor Corriendo en el puerto ${Port} `))
// =========== CORRIENDO APLICACION=======
App.get('/',(req,res)=>{
    var productos = fs.promises.readFile(FILE_PRODUCTOS)
        .then(data => data.toString('utf-8'))
        .then(datos => {
            const json = JSON.parse(datos);
            {json.length>0?(res.render("main",{json , listExist:true})):(res.render("main",{listExist:false}))}
            
        })
})




