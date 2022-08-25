const inputSearch = document.querySelector("#querySearch");
const containerInput = document.querySelector(".input");
let titleValue = document.querySelector("#title");
let penulisvalue = document.querySelector("#penulis");
let terbitValue = document.querySelector("#terbit");
let sinopsisValue = document.querySelector("#sinopsis");
const textBooks = document.querySelector("#textBooks");
const removeAll = document.querySelector("#removeAll");
const images = document.querySelector("#img");
const modals = document.querySelector(".modal");
const addBooks = document.querySelector("#addBooks");
const close = document.querySelectorAll("#close");
let isDetails = false;

// Show dialog
addBooks.addEventListener("click", function (e) {
  e.preventDefault();
  modals.showModal();
  isUpdate = false;
  document.querySelector("#sinopsis").value =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet omnis perspiciatis harum accusamus molestias quae ea voluptate ratione accusantium, dolorem illo perferendis voluptatibus fugiat alias assumenda quaerat dolorum nobis voluptatem?";
  document.querySelector(".details__book").style.display = "none";
  document.querySelector(".form__modal").style.display = "block";
  textBooks.textContent = "Add Books";
});

// Tombol close dialog
for (const c of close) {
  c.addEventListener("click", function (e) {
    e.preventDefault();
    modals.close();
    changeForm();
  });
}

// Pesan Messages
function alertMessage(message) {
  const alert = document.querySelector(".container__alert");
  const closeAlert = document.querySelector(".alert__close a");
  const alertContent = document.querySelector(".alert__main p");
  alert.classList.add("active");
  alertContent.textContent = `Success: ${message}`;

  closeAlert.addEventListener("click", function (e) {
    e.preventDefault();
    alert.classList.remove("active");
  });

  setTimeout(() => {
    alert.classList.remove("active");
  }, 3000);
}
