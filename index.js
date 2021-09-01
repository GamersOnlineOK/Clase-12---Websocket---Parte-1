const exp = require('constants');
const express = require('express');
const handlebars = require('express-handlebars');
const fs = require("fs");
const App = express();
const FILE_PRODUCTOS = "productos.txt";
const productos = require('./rutas/productos.route');
const http = require('http').Server(App);
// Le pasamos la constante http
const io = require('socket.io')(http);

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

io.on("connection", (socket) => {
    console.log("usuario conectado");
  
    socket.emit("productos", productos);
  
    socket.on("productoNuevo", (data) => {
        const array = 
        {
            titulo: req.body.titulo,
            price: req.body.price,
            img: req.body.img,
            
        };
        
       
        fs.promises.readFile(FILE_PRODUCTOS).then(data => {

            const json = JSON.parse(data.toString('utf-8'));
            const producto=({...array, id:json.length +1});
            const productoFinal=json.push(producto);
            res.redirect('/api/productos/listar')
            fs.promises.writeFile(FILE_PRODUCTOS, JSON.stringify(json, null, "\t"))
            .then(() => {
                console.log("Producto Agregado Correctamente");
                
            })
        }).then(data=>{
            fs.promises.readFile(FILE_PRODUCTOS)
            .then(data=>JSON.parse(data.toString('utf-8')))
            .then(data=>res.json(data.length))
            
        }) 
      });
      io.sockets.emit("productos", productos);
    });
  




