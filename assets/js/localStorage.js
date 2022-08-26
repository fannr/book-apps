const STORAGE_KEY = "BOOK_APPS";

// Images
const img = ["asuna", "elaina", "hori", "marin", "nami", "yukino"];

let todoBooks = [];
let isUpdate = false;

// Utility
function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// array month
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// format date
const formatDate = (date) => {
  let formatted_date = `${date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;
  return formatted_date;
};

// Utility

// ngeload todobooks ketika pertama kali dibuka di web
function loadDataFromStorage() {
  const dataBooks = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (dataBooks !== null) {
    todoBooks = dataBooks;
    showBooks(todoBooks);
  }

  if (todoBooks.length == 0) {
    document.querySelector("#removeAll").classList.add("hide");
  }
}

// nmenampilkan buku dengan meloopingnya dari array todoBooks
function showBooks(data, filter = "all") {
  let containerBooks = document.querySelector(".container__books");
  let totalBooks = [];

  containerBooks.innerHTML = data
    .map((book, index) => {
      const { isComplete, title, penulis, terbit, id } = book;

      if (filter == isComplete || filter == "all") {
        totalBooks.push(book);
        return `<div class="container__books__card">
          <p class="cekRead ${isComplete == "completed" ? "active" : ""}">${
          isComplete == "completed" ? "Sudah" : "Belum"
        } Dibaca!</p>
        <div class="books__img">
          <img
            src="assets/img/${
              title.toLowerCase() != "elaina" &&
              title.toLowerCase() != "nami" &&
              title.toLowerCase() != "yukino" &&
              title.toLowerCase() != "marin" &&
              title.toLowerCase() != "asuna" &&
              title.toLowerCase() != "robin" &&
              title.toLowerCase() != "mitsuha" &&
              title.toLowerCase() != "nishimiya" &&
              title.toLowerCase() != "hori"
                ? "default"
                : title.toLowerCase()
            }.jpg"
            alt="Books"
          />
        </div>
        <h3>${title}</h3>
        <p><span>${penulis}</span><span>${formatDate(
          new Date(terbit)
        )}</span></p>

        <div class="tooltip">
          <div class="tooltip__content">
            <a href="#" onclick="editButtons(${id}, ${index})"
              ><i class="bi bi-pencil-square"></i> <span>Update</span></a
            >
            <a href="#" onclick="deleteBooks(${index})"
              ><i class="bi bi-trash3-fill"></i> <span>Delete</span></a
            >
            <a href="#" onclick="detailBook(${id})"
              ><i class="bi bi-box-arrow-in-up-left"></i>
              <span>Details</span></a
            >
            
            <a href="#" onclick="cekReadBooks(${index}, ${
          isComplete == "completed" ? true : false
        })"
              ><i class="bi bi-check2-circle"></i>
              <span>${isComplete == "completed" ? "Undo" : ""} Read!</span></a
            >
          </div>
          <div class="tooltip__hover">
            <span></span>
          </div>
        </div>
      </div>`;
      }
    })
    .join(" ");

  document.querySelector("#total").textContent = totalBooks.length;
  if (totalBooks.length == 0) {
    containerBooks.innerHTML = "<h2>Add your new book!</h2>";
    document.querySelector("#removeAll").classList.add("hide");
  } else {
    document.querySelector("#removeAll").classList.remove("hide");
  }

  const card = document.querySelectorAll(".container__books__card");
  for (const c of card.entries()) {
    setTimeout(() => {
      c[1].classList.add("active");
    }, c[0] * 200);
  }
}

// ngecek apakah browser mendukung localstorage atau tidak
function isStorageExist() {
  if (typeof Storage === undefined) {
    console.log("Browser kamu tidak mendukung local Storage");
    return false;
  }
  return true;
}

// add book
const form = document.querySelector("form");
let elIdBooks;
let findTodo;
form.addEventListener("submit", addData);
function addData() {
  // data book for add to todoBooks
  let dataBooks = {
    id: new Date().getTime(),
    title: titleValue.value.trim(),
    penulis: penulisvalue.value.trim(),
    terbit: terbitValue.value.trim(),
    sinopsis: sinopsisValue.value.trim(),
    isComplete: findTodo
      ? findTodo.isComplete == "completed"
        ? "completed"
        : "pending"
      : "pending",
  };

  // for update
  if (isUpdate) {
    updateBooks(elIdBooks, dataBooks);
    alertMessage("Updated Data!");
  } else {
    // for add
    todoBooks.push(dataBooks);
    alertMessage("Add Data!");
  }

  saveData(todoBooks);
  modals.close();
  changeForm();
}

// delete book with id
function deleteBooks(idBooks) {
  const confirmUser = confirm("anda yakin?");
  if (!confirmUser) return;
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  data.splice(idBooks, 1);
  saveData(data);
  alertMessage("Delete Data!");
}

// temukan buku berdasarkan idBook
function findBooks(booksId) {
  for (const book of todoBooks) {
    if (book.id === booksId) {
      return book;
    }
  }

  return null;
}

// ketika nge click edit buttons, mge get data books by id, dan update input form
function editButtons(idBooks, idElementBooks) {
  isUpdate = true;
  const data = findBooks(idBooks);
  elIdBooks = idElementBooks;
  findTodo = findBooks(idBooks);

  changeForm({ data });

  modals.showModal();

  document.querySelector(".details__book").style.display = "none";
  document.querySelector(".form__modal").style.display = "block";

  textBooks.textContent = "Update Books";
}

// function updateBooks
function updateBooks(index, value) {
  const array = JSON.parse(localStorage.getItem(STORAGE_KEY));
  array[index] = value;
  saveData(array);
}

// deleteAll books
removeAll.addEventListener("click", function (e) {
  e.preventDefault();
  const filter = this.dataset.filter;
  const newData = todoBooks.filter((book) => {
    return book.isComplete != filter;
  });

  const confirmUser = confirm("yakin?");

  if (!confirmUser) return;

  if (filter == "all") {
    todoBooks = [];
  } else {
    todoBooks = newData.map((b) => {
      return b;
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(todoBooks));
  showBooks(todoBooks, filter);
  alertMessage("DeleteAll Data!");
});

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  loadDataFromStorage();
}

// reset form and update input form
function changeForm({ data } = "") {
  const { title, penulis, terbit, sinopsis } = data || "";

  titleValue.value = title || "";
  penulisvalue.value = penulis || "";
  terbitValue.value = terbit || "";
  sinopsisValue.value = sinopsis || "";
}

// nge filter data ketika diclick span (semua,Belum Dibaca, Selesai Dibaca)
const elSpan = document.querySelectorAll(".container__category span");
for (let span of elSpan) {
  span.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(".container__category span.active")
      .classList.remove("active");
    this.classList.add("active");

    const getFilter = this.dataset.filter;
    querySearch.dataset.filter = getFilter;
    removeAll.dataset.filter = getFilter;
    showBooks(todoBooks, getFilter);
  });
}

// function untuk nge set isCompleted (pending, completed). buku dibaca/belum
function cekReadBooks(idElement, isCompleted) {
  const book = JSON.parse(localStorage.getItem(STORAGE_KEY));
  book[idElement].isComplete = isCompleted ? "pending" : "completed";
  const filter = document.querySelector(".container__category span.active")
    .dataset.filter;

  todoBooks = book.map((b) => {
    return b;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(todoBooks));
  showBooks(todoBooks, filter);

  if (isCompleted) {
    alertMessage("Undo Read!");
  } else {
    alertMessage("Read Book!");
  }
}

// querySearch by title and filter
inputSearch.addEventListener("keyup", function () {
  const filter = this.dataset.filter;
  let value = this.value.toLowerCase();

  const todo = todoBooks.filter((t) => {
    if (t.isComplete == filter || filter == "all") {
      return t;
    }
  });

  const data = getDataFilterByUserInput(value, todo);

  showBooks(data);
});

// function get data by filter (all,pending, completed)
function getDataFilterByUserInput(value, data, filter) {
  const getFilterData = data.filter((t) => {
    title = t.title.toLowerCase();
    if (title.includes(value)) {
      return t;
    }
  });

  return getFilterData;
}

function detailBook(id) {
  const book = findBooks(id);

  document.querySelector(".details__book").style.display = "block";
  document.querySelector(".form__modal").style.display = "none";
  document.querySelector("#sinopsis").value =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet omnis perspiciatis harum accusamus molestias quae ea voluptate ratione accusantium, dolorem illo perferendis voluptatibus fugiat alias assumenda quaerat dolorum nobis voluptatem?";
  document
    .querySelector(".detail__img")
    .setAttribute(
      "src",
      `assets/img/${
        book.title.toLowerCase() != "elaina" &&
        book.title.toLowerCase() != "nami" &&
        book.title.toLowerCase() != "yukino" &&
        book.title.toLowerCase() != "marin" &&
        book.title.toLowerCase() != "asuna" &&
        book.title.toLowerCase() != "robin" &&
        book.title.toLowerCase() != "mitsuha" &&
        book.title.toLowerCase() != "nishimiya" &&
        book.title.toLowerCase() != "hori"
          ? "default"
          : book.title.toLowerCase()
      }.jpg`
    );
  document.querySelector(".detail__title").textContent = book.title;
  document.querySelector(".detail__penulis").textContent = book.penulis;
  document.querySelector(".detail__terbit").textContent = formatDate(
    new Date(book.terbit)
  );
  document.querySelector(".detail__sinopsis").textContent = book.sinopsis;

  document.querySelector(".modal").showModal();
}

// load data in todoBooks
if (isStorageExist()) {
  loadDataFromStorage();
}
