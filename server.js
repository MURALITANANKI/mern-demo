const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/contactlist');

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String
});

const ContactModel = mongoose.model('contact', contactSchema);

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')))
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('/contact', jsonParser, (req, res) => {
    ContactModel.find({}).then((contacts) => {
        res.send(contacts);
    });
});

app.post('/contact', jsonParser, (req, res) => {
    console.log(req.body);
    let cObj = new ContactModel({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile
    });
    cObj.save();
    res.send(cObj);
});

app.put('/contact/:id', jsonParser, (req, res) => {
    /**
     * 1st argument record match query [example record will be updated with matching ID]
     * 2nd argument JSON object to be update [exampler 'req.body' is request body object]
     * 3rd argument {new: true} will give the updated record in response or it'll old record in response though record update
     */
    ContactModel.findOneAndUpdate({ _id: req.params.id }, req.body, {new: true}).then((contact) => {
        console.log('Updated contact : ', contact);
        res.send(contact);
    });
});

app.delete('/contact/:id', jsonParser, (req, res) => {
    ContactModel.deleteOne({ _id: req.params.id }).then((contact) => {
        res.send(contact);
    });
});

app.listen(3000, () => {
    console.log('server running...');
});