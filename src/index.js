const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const eventRoutes = require('./routes/events'); // Importa las rutas de eventos
const mongoose = require('mongoose'); // Asegúrate de usar Mongoose para conectar la base de datos

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos (asegúrate de reemplazar con tu URI de MongoDB)
mongoose.connect('mongodb://localhost:27017/bets', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a la base de datos MongoDB'))
    .catch((error) => console.error('Error al conectar a la base de datos:', error));

// Ruta para obtener eventos desde la API externa
// app.get('/api/events', async (req, res) => {
//     try {
//         const response = await axios.get(
//             'https://betapi.zgameslatam.com/v1/api/sport-events/prematch-highlights?sportId=sr:sport:1&statusSportEvent=NotStarted&marketId=1&limit=10'
//         );
//         res.status(200).json({
//             statusCode: 200,
//             status: 'Success',
//             message: 'Data fetched successfully',
//             data: response.data.data,
//         });
//     } catch (error) {
//         console.error('Error al obtener datos:', error.message);
//         res.status(500).json({
//             statusCode: 500,
//             status: 'Error',
//             message: 'Error fetching data from external API',
//         });
//     }
// });

// Ruta para obtener los eventos con soporte de múltiples deportes
app.get('/api/events', async (req, res) => {
    try {
        const sportId = req.query.sportId; // Leer el parámetro sportId desde la query
        let urls = [];

        // Si se especifica un sportId, filtra por ese deporte
        if (sportId) {
            urls.push(
                `https://betapi.zgameslatam.com/v1/api/sport-events/prematch-highlights?sportId=${sportId}&statusSportEvent=NotStarted&marketId=1&limit=10`
            );
        } else {
            // Si no se especifica un sportId, incluye ambos deportes por defecto
            urls = [
                'https://betapi.zgameslatam.com/v1/api/sport-events/prematch-highlights?sportId=sr:sport:1&statusSportEvent=NotStarted&marketId=1&limit=10',
                'https://betapi.zgameslatam.com/v1/api/sport-events/prematch-highlights?sportId=sr:sport:2&statusSportEvent=NotStarted&marketId=1&limit=10',
            ];
        }

        // Hacer solicitudes a todas las URLs
        const responses = await Promise.all(urls.map((url) => axios.get(url)));

        // Combinar los datos recibidos
        const events = responses.flatMap((response) => response.data.data);

        // Enviar la respuesta al cliente
        res.status(200).json({
            statusCode: 200,
            status: 'Success',
            message: 'Data fetched successfully',
            data: events,
        });
    } catch (error) {
        console.error('Error al obtener datos:', error.message);
        res.status(500).json({
            statusCode: 500,
            status: 'Error',
            message: 'Error fetching data from external API',
        });
    }
});

// Conectar las rutas de eventos
app.use('/api/events', eventRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
