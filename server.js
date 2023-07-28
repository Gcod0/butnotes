const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { error } = require('console');

// function to write notes to db.json file

// const addNote = function (title, body) {    
// const notes = loadNotes()

// notes.push({
//     title: title,
//     body: body
// })

// saveNotes(notes)
// }

// // function to save notes to db.json file

// const saveNotes = function (notes) {
//     const dataJSON = JSON.stringify(notes)
//     fs.writeFileSync('notes.json', dataJSON)

// }

// const loadNotes = function () {
//     try {
//         const dataBuffer = fs.readFileSync('db/db.json')
//     const dataJSON = dataBuffer.toString()
//     return JSON.parse(dataJSON)
//     } catch (e) {
//     return []
//     }
// }

// // setting up server 
const PORT = process.env.PORT || 3001;
const app = express();

const readAsync = util.promisify(fs.readFile)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// // middleware
app.use(express.static("public"));

// // routes
app.get('/api/notes', (req, res) => {
    readAsync('./db/db.json'). then((data)=> {
        res.json(JSON.parse(data))
    })
});


app.post('/api/notes', (req, res) => {
    const randomId = Math.floor(Math.random() * 1000)
  //  const randomId2 = uuid()
    const newNote = {...req.body, id: randomId};
    // { title: 'title",
//       text: 'whatever the text is',
//       id: 7}
//to generate a random number
    readAsync('./db/db.json')
    .then((data) => {
        const noteArray = JSON.parse(data);
        noteArray.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(noteArray), function (err){
            if (err) {
                console.log(err)
            
            } else {
                res.json(newNote);
            }
        })
        // .then(() => {
        //     res.json(newNote);
        // });
    });
}
);

app.delete('/api/notes/:id', (req, res) => {
    const idToDelete = req.params.id;
    //note.id is a number, idToDelete is a string. these two will never equal each other becasue they are different data types
    //how can we make them the same datatype
    console.log(idToDelete, typeof idToDelete)
    readAsync('./db/db.json')
    .then((data) => {
        const noteArray = JSON.parse(data);
        const newNoteArray = noteArray.filter((note) => note.id !== idToDelete);
        console.log(newNoteArray
            )
        fs.writeFile('./db/db.json', JSON.stringify(newNoteArray), function (err){
            if (err) {
                console.log(err)
            
            } else {
                res.json({ok:true}
                );
            }
        })
        
    });
}
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});




