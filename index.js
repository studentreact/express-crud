const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

let books = JSON.parse(fs.readFileSync('books.json'));

app.use(express.json());


app.get('/books', (req, res) => {
  res.json(books);
});
app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const book = books.find((book) => book.id == bookId);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'topilmadi' });
  }
});

app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (books.some((book) => book.title === title)) {
    res.status(409).json({ message: 'ushbu kitob mavjud' });
  } else {
    const newBook = {
      id: books.length + 1,
      title,
      author,
    };
    books.push(newBook);
    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
    res.status(201).json(newBook);
  }
});

app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, author } = req.body;
  const book = books.find((book) => book.id == bookId);
  if (book) {
    book.title = title;
    book.author = author;
    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
    res.json(book);
  } else {
    res.status(404).json({ message: 'kitob topilmadi' });
  }
});
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const index = books.findIndex((book) => book.id == bookId);
  if (index !== -1) {
    books.splice(index, 1);
    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
    res.json({ message: 'kitob uchirildi' });
  } else {
    res.status(404).json({ message: 'kitob topilmadi' });
  }
});

app.listen(port, () => {
  console.log('Server is listening on port ${port}');
});
