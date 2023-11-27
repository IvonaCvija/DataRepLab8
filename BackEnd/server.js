const express = require('express')
const app = express()
const port = 4000;
const cors = require('cors');


// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// Middleware to set headers for CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const bodyParser = require('body-parser');
// Parse incoming requests with JSON and URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connection setup
const mongoose = require('mongoose');

main().catch(err => console.log(err));

// Connect to the MongoDB database
async function main() {
    // username:password
    await mongoose.connect('mongodb+srv://user:user2023@cluster0.1kojhqr.mongodb.net/?retryWrites=true&w=majority');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled, 
}
// Book schema definition
const bookSchema = new mongoose.Schema({
    title:String,
    cover:String,
    author:String
})
// Create a model based on the book schema   
const bookModel = mongoose.model(`books`, bookSchema)

//updating existing data using id
app.put('/api/book/:id', async (req,res)=>{

    console.log("Update: "+req.params.id);

    //await so it changes it only after finding the book
    let book = await bookModel.findByIdAndUpdate(req.params.id, req.body, {new:true});
    res.send(book);
})
// Create a new book entry
app.post('/api/book', (req, res) => {
    console.log(req.body);
    // Create a new book using the data from the request body
    bookModel.create({
        title:req.body.title,
        cover:req.body.cover,
        author:req.body.author
    })
    //res.send("Data Received!");
    .then(() =>{res.send("Book created")})
    .catch(() =>{res.send("Book not created")})
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})
// Get a specific book by ID
app.get(`/api/book/:id`, async (req, res)=>{
    console.log(req.params.id);
    // Find a book by its ID
    let book = await bookModel.findById({_id:req.params.id})
    res.send(book);
})
// Listen on the specified port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
// Get all books
app.get('/api/books', async (req, res) => {
    
    let books = await bookModel.find({});
    res.json(books);
})
