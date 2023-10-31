//Importamos en framework de Express (necesario instalar el framework previamente)
const express = require("express");
//Importamos la librería body-parser que nos permite especificar el formato del documento
const bodyParser = require("body-parser"); //el bodyparser va muy de la mano con express
//Definimos el puerto que usará nuestro servidor
const PORT = 3001;

//Creamos el objeto que definirá el comportamiento de los verbos/métodos de HTTP. creamos la "instancia" después de haber importado el framework de express.
const app = express();

app.use(bodyParser.json()); //a esto le pasamos nuestro objeto

//Definimos el comportamiento (2º argumento) de nuestra aplicación cuando alguien accede mediante el método POST al endpoint (1er argumento)
/*
Ejemplo:
http://localhost:3001/cliente/1 ->Hola mundo!
*/

/*{
    'nombre': 'Bárbara',
    'apellido1': 'Estévez',
    'apellido2': 'Simonet',
    'DNI': 03120054N
}*/

var errors = [];

app.post("/cliente/:id", async (req, res) => { //tenemos que trabajar de manera asíncrona
  try {
    const { nombre, apellido1, apellido2, DNI } = req.body;
    const ID = req.params.id;
    if (!ID) {
      errors.push("Se requiere un ID en el verbo POST.");
    }
    await validarCampos(nombre.trim(), apellido1.trim(), apellido2.trim(), DNI.trim()); //await espera al método validarCampos
    if(errors.length>0) throw new Error (errors.join('\n'))

    const respuesta = {
      mensaje: "¡Formulario Válido!",
      cliente: {
        ID: ID,
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

// app.get('/cliente/:id',(req,res)=>{
//     res.send('¡Hola Mundo! Estoy en el servidor!!');
//     console.log('Qué pasa tron!')
// });

app.put("/cliente", () => {
  res.put("eoooo!");
  console.log("Hola tron-K!");
});

async function validarCampos(nombre, apellido1, apellido2, DNI) {
  if (nombre.length < 1 || nombre.length > 10) errors.push("El nombre no tiene el tamaño adecuado.");
  if (apellido1.length < 1 || apellido1.length > 10) errors.push("El apellido1 no tiene el tamaño adecuado.");
  if (apellido2.length < 1 || apellido2.length > 10) errors.push("El apellido2 no tiene el tamaño adecuado.");
  if (!/^[0-9]{8}[A-Z]$/.test(DNI)) errors.push("El DNI no es correcto.");
}

app.listen(PORT, () => {
  console.log(`El fascinante MEGA-Servidor Express está escuchando el puerto ${PORT}!!`);
});
