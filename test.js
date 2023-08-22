const fs = require('fs');
const datos = require('./channels.js');

// Modificar el objeto
datos.channels.edad = 31;
datos.channels.profesion = "Ingeniero";

// Convertir el objeto a formato JSON
const objetoJSON = JSON.stringify(datos, null, 2);

// Escribir el objeto JSON en el archivo
fs.appendFile('./channels.js', `module.exports = ${objetoJSON};` + '\n', (err) => {
  if (err) {
    console.error('Error al escribir en el archivo:', err);
  } else {
    console.log('Cambios guardados en el archivo.');
  }
});