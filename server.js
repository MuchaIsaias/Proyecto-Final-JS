// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs/promises');
// const cors = require('cors');

// const app = express();
// const port = 5500;
// app.use(cors());

// app.use(bodyParser.json());

// // Ruta para manejar solicitudes POST de registro de usuarios
// app.post('/crear-usuario', async (req, res) => {
//     try {
//         // Lee el archivo de usuarios existente
//         const usuariosData = await fs.readFile('/js/usuarios.json', 'utf8');
//         const usuarios = JSON.parse(usuariosData);

//         // Obtiene los datos del cuerpo de la solicitud POST
//         const nuevoUsuario = req.body;

//         // Agrega el nuevo usuario al array de usuarios
//         usuarios.push(nuevoUsuario);

//         // Escribe el array actualizado en el archivo
//         await fs.writeFile('/js/usuarios.json', JSON.stringify(usuarios), 'utf8');

//         // Envía una respuesta de éxito
//         res.json({ mensaje: 'Usuario registrado con éxito' });
//     } catch (error) {
//         console.error('Error al registrar usuario:', error);
//         res.status(500).json({ mensaje: 'Error interno del servidor' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Servidor Express escuchando en http://localhost:${port}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const path = require('path'); // Añade esta línea
const cors = require('cors');

const app = express();
const port = 4000;
app.use(cors());

app.use(bodyParser.json());

// Ruta para manejar solicitudes POST de registro de usuarios
app.post('/crear-usuario', async (req, res) => {
    try {
        // Obtén la ruta absoluta del archivo usuarios.json
        const usuariosPath = path.join(__dirname, 'js', 'usuarios.json');

        // Lee el archivo de usuarios existente
        const usuariosData = await fs.readFile(usuariosPath, 'utf8');
        const usuarios = JSON.parse(usuariosData);

        // Obtiene los datos del cuerpo de la solicitud POST
        const nuevoUsuario = req.body;

        // Agrega el nuevo usuario al array de usuarios
        usuarios.push(nuevoUsuario);

        // Escribe el array actualizado en el archivo
        await fs.writeFile(usuariosPath, JSON.stringify(usuarios), 'utf8');

        // Envía una respuesta de éxito
        res.json({ mensaje: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});