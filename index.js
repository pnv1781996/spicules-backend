const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { z } = require("zod");

const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const MONGODB_URI = "mongodb+srv://pp4560900:tKjxXdZhC0Z4J00O@ecommerce-cluster.bxzv3pu.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define MongoDB Schema
const FormSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  agreedTerms: { type: Boolean, required: true },
});

// Create MongoDB Model
const FormModel = mongoose.model('Form', FormSchema);

// Define Zod schema for form validation
const FormSchemaValidator = z.object({
  phone: z.string().min(6).max(20),
  agreedTerms: z.boolean(),
});


// API endpoint for form submission
app.post('/submit-form', async (req, res) => {
  try {
    // Validate request body using Zod
    const validatedData = FormSchemaValidator.parse(req.body);

    // Check if phone number already exists
    const existingForm = await FormModel.findOne({ phone: validatedData.phone });
    if (existingForm) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    // Create new document in MongoDB
    const formData = new FormModel(validatedData);
    await formData.save();

    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(400).json({ error: error.errors });
  }
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
