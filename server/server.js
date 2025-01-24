const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

const keywordResponses = {
    "direccion": "La dirección del restaurante es Avenida Mate de Luna 4305, San Miguel de Tucumán.",
    "horarios": "Nuestro horario de atención es de lunes a viernes de 12:00 p.m. a 10:00 p.m.",
    "telefono": "Puedes contactarnos al número +54 9 381 1234567.",
    "comida": "Tenemos amplios tipos de platillos, siéntase libre de ver nuestra carta en la sección Carta.",
    "ambiente": "Nuestro ambiente es familiar, amistoso y elegante.",
    "reservacion": "Para hacer una reservación, puedes contactarnos al número +54 9 381 1234567.",
    "accesibles": "Tenemos diversos tipos de platillos, desde comida rápida hasta platos finamente elaborados.",
    "musica": "Nuestra variedad musical recorre folclore, música clásica y elegante.",
    "hola": "¡Saludos! ¿En qué puedo ayudarte?",
    "especialidad": "Tenemos muchos platos de altísima calidad, recomendamos encarecidamente ver nuestra carta para saber más.",
    "bebida": "Disponemos de todo tipo de bebidas, tanto alcohólicas como no alcohólicas, siéntase libre de consultar por la disponibilidad de las mismas."
};
app.post('/create-admin', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash("mauro", 10);
      
      await Usuarios.create({
        nombre: "Admin",
        apellido: "Sistema",
        mail: "admin@example.com",
        contraseña: hashedPassword
      });
  
      res.send("Admin creado!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al crear admin");
    }
  });
app.post('/api/chatbot', (req, res) => {
    const { message } = req.body;
    let response = "Lo siento, no entendí la pregunta.";

    Object.keys(keywordResponses).forEach(keyword => {
        if (message.toLowerCase().includes(keyword)) {
            response = keywordResponses[keyword];
        }
    });

    res.json({ response });
});

const MONGO_URI = 'mongodb://127.0.0.1:27017/Restaurante';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Conectado a la base de datos");
    })
    .catch((e) => {
        console.error('Error al conectar a la base de datos:', e);
    });

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const opcionesSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    etiquetas: [{ type: String }],
    imagen: { type: String },
});
const Opciones = mongoose.model('Opciones', opcionesSchema);

const datosSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    mail: { type: String, required: true },
    reseñas: { type: String, required: true },
});
const Datos = mongoose.model('Datos', datosSchema);

app.get('/platos', async (req, res) => {
    try {
        const platos = await Opciones.find();
        res.json(platos);
    } catch (error) {
        console.error('Error al obtener los platos:', error);
        res.status(500).send('Error al obtener los platos de la base de datos.');
    }
});

app.post('/register', async (req, res) => {
    const { nombre, apellido, mail, reseñas } = req.body;
    try {
        const newDatos = new Datos({ nombre, apellido, mail, reseñas });
        await newDatos.save();
        res.status(201).send('Datos Registrados!');
    } catch (error) {
        console.error('Error al registrar los datos:', error);
        res.status(500).send('Error al registrar los datos en la base de datos.');
    }
});

app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Datos.find();
        res.json(reviews);
    } catch (error) {
        console.error('Error al obtener las reseñas:', error);
        res.status(500).send('Error al obtener las reseñas de la base de datos.');
    }
});

app.delete('/delete-review/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReview = await Datos.findByIdAndDelete(id);
        if (!deletedReview) {
            return res.status(404).send('Reseña no encontrada para eliminar.');
        }
        res.status(200).send('Reseña eliminada correctamente.');
    } catch (error) {
        console.error('Error al eliminar la reseña:', error);
        res.status(500).send('Error al eliminar la reseña de la base de datos.');
    }
});

app.post('/add-option', upload.single('imagen'), async (req, res) => {
    const { nombre, descripcion, precio, etiquetas } = req.body;
    const imagen = req.file ? req.file.filename : null;

    try {
        const etiquetasArray = typeof etiquetas === 'string' ? JSON.parse(etiquetas) : etiquetas;

        const newOption = new Opciones({ nombre, descripcion, precio, etiquetas: etiquetasArray, imagen });
        await newOption.save();
        res.status(201).send('Plato agregado a la carta!');
    } catch (error) {
        console.error('Error al guardar el plato:', error);
        res.status(500).send('Error al guardar el plato en la base de datos.');
    }
});

app.put('/update-option/:id', upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, etiquetas } = req.body;
    const imagen = req.file ? req.file.filename : null;

    try {
        const etiquetasArray = typeof etiquetas === 'string' ? JSON.parse(etiquetas) : etiquetas;
        const updateData = { nombre, descripcion, precio, etiquetas: etiquetasArray };
        if (imagen) {
            updateData.imagen = imagen;
        }
        const updatedOption = await Opciones.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedOption) {
            return res.status(404).send('Plato no encontrado para actualizar.');
        }
        res.status(200).send('Plato actualizado correctamente.');
    } catch (error) {
        console.error('Error al actualizar el plato:', error);
        res.status(500).send('Error al actualizar el plato en la base de datos.');
    }
});

app.delete('/delete-option/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOption = await Opciones.findByIdAndDelete(id);
        if (!deletedOption) {
            return res.status(404).send('Plato no encontrado para eliminar.');
        }
        res.status(200).send('Plato eliminado correctamente.');
    } catch (error) {
        console.error('Error al eliminar el plato:', error);
        res.status(500).send('Error al eliminar el plato de la base de datos.');
    }
});

app.get('/api/whatsapp', (req, res) => {
    const phoneNumber = '';
    const message = 'Hola, me gustaría obtener más información sobre sus servicios.';
    res.json({ phoneNumber, message });
});

const usuariosSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    mail: { type: String, required: true },
    contraseña: { type: String, required: true },
});

const Usuarios = mongoose.model('Usuarios', usuariosSchema);

// Registrar usuario
app.post('/registro', async (req, res) => {
    const { nombre, apellido, mail, contraseña } = req.body;

    if (!nombre || !apellido || !mail || !contraseña) {
        return res.status(400).send('Todos los campos son requeridos.');
    }

    try {
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        const newUsuario = new Usuarios({ 
            nombre, 
            apellido, 
            mail, 
            contraseña: hashedPassword 
        });

        await newUsuario.save();
        res.status(201).send('Datos Registrados!');
    } catch (error) {
        console.error('Error al registrar los datos:', error);
        res.status(500).send('Error al registrar los datos en la base de datos.');
    }
});

// Iniciar sesión
// En tu servidor (app.js), verifica el endpoint de login:
app.post('/login', async (req, res) => {
    try {
      const { mail, contraseña } = req.body;
      
      // 1. Validación de campos
      if (!mail || !contraseña) {
        return res.status(400).json({ 
          success: false, 
          error: "Todos los campos son requeridos" 
        });
      }
  
      // 2. Buscar usuario (case-insensitive)
      const user = await Usuarios.findOne({ 
        mail: { $regex: new RegExp(`^${mail}$`, 'i') } 
      });
  
      console.log('Usuario encontrado:', user); // Debug
  
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: "Usuario no registrado" 
        });
      }
  
      // 3. Comparar contraseñas
      const validPassword = await bcrypt.compare(contraseña, user.contraseña);
      console.log('¿Contraseña válida?', validPassword); // Debug
  
      if (!validPassword) {
        return res.status(401).json({ 
          success: false, 
          error: "Contraseña incorrecta" 
        });

// Agrega estos logs en tu endpoint de login
console.log('Datos recibidos:', req.body);
console.log('Usuario encontrado:', user);
console.log('Comparación de contraseña:', validPassword);

      }
  
      // 4. Generar token
      const token = jwt.sign(
        {
          id: user._id,
          role: user.mail === 'admin@example.com' ? 'admin' : 'user'
        },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1h' }
      );
  
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          mail: user.mail,
          role: user.mail === 'admin@example.com' ? 'admin' : 'user'
        }
      });
  
    } catch (error) {
      console.error('Error en servidor:', error);
      res.status(500).json({ 
        success: false, 
        error: "Error interno del servidor" 
      });
    }
  });
  app.post('/create-admin', async (req, res) => {
    try {
      const password = "mauro"; // Contraseña exacta
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await Usuarios.create({
        nombre: "Admin",
        apellido: "Sistema",
        mail: "admin@example.com",
        contraseña: hashedPassword
      });
  
      res.send("Admin creado correctamente");
    } catch (error) {
      console.error("Error creando admin:", error);
      res.status(500).send("Error interno");
    }
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});