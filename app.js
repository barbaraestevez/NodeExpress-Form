//! EJERCICIO 2
//! Genere un formulario de tipo cliente que valide los siguientes campos
//! • Nombre (10 caracteres)
//! • Apellido1 (10 caracteres)
//! • Apellido2 (10 caracteres)
//! • NIF/NIE/CIF (Valido)
//! Si es mandado por método POST, se debe enviar un ID obligatorio
//! Si es mandado por PUT, el ID debe estar vacio.

//! En caso de error se debe mandar un mensaje al cliente indicando el tipo de error
//! detectado.


//Importamos en framework de Express (necesario instalar el framework previamente)
const express = require("express");
//Importamos la librería body-parser que nos permite especificar el formato del documento
const bodyParser = require("body-parser"); //el bodyparser va muy de la mano con express
//Definimos el puerto que usará nuestro servidor
const PORT = 3000;

//Creamos el objeto que definirá el comportamiento de los verbos/métodos de HTTP. creamos la "instancia" después de haber importado el framework de express.
const app = express();

//Se utiliza el middleware bodyParser para analizar datos codificados (propio de las solicitudes POST y PUT)
//utilizando el urlencoded para evitar estructuras anidadas, matrices y objetos complejos.
//Sin parámetros, el método está deprecated.
// Con parámetro extended:false -> se utiliza la especificación querystring library https://www.npmjs.com/package/query-string
// Con parámetro extended:true -> se utiliza la especificación qs library https://www.npmjs.com/package/qs
app.use(bodyParser.urlencoded({extended:false})); //
app.use(bodyParser.json()); //a esto le pasamos nuestro objeto

//Definimos el comportamiento (2º argumento) de nuestra aplicación cuando alguien accede mediante el método POST al endpoint (1er argumento)
/*
Ejemplo:
http://localhost:3000/cliente/1 ->Hola mundo!
*/

/*{
    'nombre': 'Bárbara',
    'apellido1': 'Estévez',
    'apellido2': 'Simonet',
    'DNI': 03120054N
}*/

//Creamos una array donde añadiremos los mensajes de error que se provoquen
var errors = [];
var PePiNo = "pepino1";
//Métodos de HTTP que establecen el endpoint y el controlador en el middleware
app.get('/', async (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.post("/cliente/:pepino", async (req, res) => { //con async indicamos que queremos trabajar de manera asíncrona
  try {
    const { nombre, apellido1, apellido2, DNI } = req.body;
    const ID = req.params.pepino;
    // if(isNaN(ID) || ID<0) { 
    //   if (!ID) {
    //    errors.push("El ID es incorrecto."); //errors.push("Se requiere un ID en el verbo POST.");
    //  }
   await validarCampos(nombre.trim(), apellido1.trim(), apellido2.trim(), DNI.trim()); //await espera al método validarCampos() termine su proceso
    
    if(errors.length>0) {
      throw new Error (errors.join('\n'));
    }

    const respuesta = {
      mensaje: "¡Formulario Válido!",
      cliente: {
        ID: ID,
        nombre: nombre,
        apellido1: apellido1,
        apellido2: apellido2,
        DNI: DNI
      },
    };
    res.json(respuesta);
  } catch (error) {
    res.status(400).send(error.message);
  } finally {
    errors = [];
  }
});

app.put("/cliente", async (req, res) => { //con async indicamos que queremos trabajar de manera asíncrona
  try {
    const { nombre, apellido1, apellido2, DNI } = req.body;
    // if(isNaN(ID) || ID<0) { //if (!ID) {
    //   errors.push("Se requiere un ID en el verbo POST.");
    // }
    await validarCampos(nombre.trim(), apellido1.trim(), apellido2.trim(), DNI.trim()); //await espera al método validarCampos()
    if(errors.length>0) throw new Error (errors.join('\n'))

    const respuesta = {
      mensaje: "¡Formulario Válido!",
      cliente: {
        nombre: nombre,
        apellido1: apellido1,
        apellido2: apellido2,
        DNI: DNI,
      },
    };
    res.json(respuesta);
  } catch (error) {
    res.status(400).send(error.messagge);
  } finally {
    errors = [];
  }
});

async function validarCampos(nombre, apellido1, apellido2, DNI) {
  if (nombre.length < 1 || nombre.length > 10) errors.push("El nombre no tiene el tamaño adecuado.");
  if (apellido1.length < 1 || apellido1.length > 10) errors.push("El apellido1 no tiene el tamaño adecuado.");
  if (apellido2.length < 1 || apellido2.length > 10) errors.push("El apellido2 no tiene el tamaño adecuado.");
  if (!/^[0-9]{8}[A-Z]$/.test(DNI)) errors.push("El DNI no es correcto.");
}

//Levantamos el servidor con el método listen()
app.listen(PORT, () => {
  console.log(`El fascinante MEGA-Servidor Express está escuchando el puerto ${PORT} a través de un ${PePiNo}!!`);
});

//Cómo ver el puerto en el que arranca Express. Que suele ser en el 3000 pero no siempre es así
// const server = app.listen();
// server.on('listening', ()=>{
//   const address = server.address();
//   console.log(`Aplicación Express escuchando en el puerto ${address.port}`);  
// })
