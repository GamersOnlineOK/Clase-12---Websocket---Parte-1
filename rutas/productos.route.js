const express=require("express");
const App = express();
const router=express.Router();
const fs = require("fs");
App.use(express.static('public'));
const FILE_PRODUCTOS = "productos.txt";

// METODOS GET
// ==============LISTAR PRODUCTO===================
router.get('/productos/listar', (req, res) => {
    var productos = fs.promises.readFile(FILE_PRODUCTOS)
        .then(data => data.toString('utf-8'))
        .then(datos => {
            const json = JSON.parse(datos);
            {json.length>0?(res.render("main",{json , listExist:true})):(res.render("main",{listExist:false}))}
            
        })
})
// ==============MOSTRAR PRODUCTO===================
router.get('/productos/listar/:id', (req, res) => {
    let parametro = req.params.id;
    fs.promises.readFile('./productos.txt')
        .then(data => data.toString('utf-8'))
        .then(datos => {
            const json = JSON.parse(datos);
            const filter=json.filter(data=>data.id==parametro);
            { filter.length>0 ? (res.json({ filter })) : (res.json({ error: 'producto no encontrado' })) }

        })
})
// METODOS POST
// ==============GUARDAR PRODUCTO===================
router.post('/productos/guardar', (req, res) => {
    
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
// METODOS PUT
router.put('/productos/actualizar/:id',(req,res)=>{
    var id=req.params.id;
    let actualizacion={
        titulo: req.body.titulo,
        price: req.body.price,
        img: req.body.img,
        
    };



    fs.promises.readFile(FILE_PRODUCTOS).then(data => {

        const json = JSON.parse(data.toString('utf-8'));
        const indexProduct=json.findIndex((obj)=>obj.id ==id);
        json[indexProduct]={...actualizacion,id:json[indexProduct].id};
        res.send(json[indexProduct])
        fs.promises.writeFile(FILE_PRODUCTOS, JSON.stringify(json, null, "\t"))
        .then(() => {
            console.log("Producto Actualizado Correctamente");
        })
    })
})
router.delete('/productos/eliminar/:id',(req,res)=>{
    var id=req.params.id;

    fs.promises.readFile(FILE_PRODUCTOS).then(data => {

        const json = JSON.parse(data.toString('utf-8'));
        const filter=json.filter(data=>data.id!=id);
        res.send(filter)
        fs.promises.writeFile(FILE_PRODUCTOS, JSON.stringify(filter, null, "\t"))
        .then(() => {
            console.log("Producto Actualizado Correctamente");
        })
    })

})
module.exports=router;