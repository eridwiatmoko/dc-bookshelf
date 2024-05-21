document.addEventListener('DOMContentLoaded', function() {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    const inputBookForm = document.getElementById('inputBook');
    const searchBookForm = document.getElementById('searchBook');
    const overlay = document.getElementById('overlay');
    const deleteConfirmation = document.getElementById('deleteConfirmation');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const closeButton = document.querySelector('.close');

    let books = [];
    const BOOK_KEY = 'bookshelf';

    function renderBook(book) {
        const bookItem = document.createElement('li');
        bookItem.classList.add('book_item');
        const bookTitle = document.createElement('h3');
        bookTitle.textContent = book.title;
        const bookAuthor = document.createElement('p');
        bookAuthor.textContent = `Penulis: ${book.author}`;
        const bookYear = document.createElement('p');
        bookYear.textContent = `Tahun: ${book.year}`;
        const bookAction = document.createElement('div');
        bookAction.classList.add('action');
        const moveBtn = document.createElement('button');
        moveBtn.textContent = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
        moveBtn.classList.add(book.isComplete ? 'green' : 'red');
        moveBtn.addEventListener('click', function() {
            toggleBookStatus(book);
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Hapus buku';
        deleteBtn.classList.add('red');
        deleteBtn.addEventListener('click', function() {
            showDeleteConfirmation(book);
        });
        bookAction.appendChild(moveBtn);
        bookAction.appendChild(deleteBtn);
        bookItem.appendChild(bookTitle);
        bookItem.appendChild(bookAuthor);
        bookItem.appendChild(bookYear);
        bookItem.appendChild(bookAction);
        if (book.isComplete) {
            completeBookshelfList.appendChild(bookItem);
        } else {
            incompleteBookshelfList.appendChild(bookItem);
        }
    }

    function toggleBookStatus(book) {
        book.isComplete = !book.isComplete;
        const index = books.findIndex(b => b.id === book.id);
        if (index !== -1) {
            books[index] = book;
            localStorage.setItem(BOOK_KEY, JSON.stringify(books));
            clearBookshelf();
            renderBookshelf();
        }
    }

    function deleteBook(book) {
        const index = books.findIndex(b => b.id === book.id);
        if (index !== -1) {
            books.splice(index, 1);
            localStorage.setItem(BOOK_KEY, JSON.stringify(books));
            clearBookshelf();
            renderBookshelf();
        }
    }

    function showDeleteConfirmation(book) {
        deleteConfirmation.style.display = 'block';
        confirmDeleteBtn.onclick = function() {
            deleteBook(book);
            hideDeleteConfirmation();
        }
        cancelDeleteBtn.onclick = function() {
            hideDeleteConfirmation();
        }
        closeButton.onclick = function() {
            hideDeleteConfirmation();
        }
    }
    
    

    function hideDeleteConfirmation() {
        overlay.style.display = 'none';
        deleteConfirmation.style.display = 'none';
    }

    function clearBookshelf() {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';
    }

    function renderBookshelf() {
        books.forEach(book => {
            renderBook(book);
        });
    }

    function addBookToShelf(event) {
        event.preventDefault();
        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = document.getElementById('inputBookYear').value;
        const isComplete = document.getElementById('inputBookIsComplete').checked;
        const book = {
            id: +new Date(),
            title,
            author,
            year: parseInt(year),
            isComplete
        };
        books.push(book);
        localStorage.setItem(BOOK_KEY, JSON.stringify(books));
        clearBookshelf();
        renderBookshelf();
        inputBookForm.reset();
    }

    function searchBook(event) {
        event.preventDefault();
        const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));
        clearBookshelf();
        filteredBooks.forEach(book => renderBook(book));
    }

    inputBookForm.addEventListener('submit', addBookToShelf);
    searchBookForm.addEventListener('submit', searchBook);

    // Initialize app
    const storedBooks = localStorage.getItem(BOOK_KEY);
    if (storedBooks) {
        books = JSON.parse(storedBooks);
        renderBookshelf();
    }
});
