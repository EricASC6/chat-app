const nextBtn = document.getElementById("entry1-next");
const entries = Array.from(document.querySelectorAll(".entry"));
const error = document.getElementById("error-field");
const errorVal = document.querySelector("#error-field p");
let currentEntryIndx = 0;

// Form
const username = document.getElementById("username");
const password = document.getElementById("password");

const validateForm = (...fields) => {
  for (let i = 0; i < fields.length; i++) {
    const fieldVal = fields[i].value;
    if (fieldVal.trim().length < 1) return false;
  }

  return true;
};

nextBtn.addEventListener("click", e => {
  e.preventDefault();

  const isValid = validateForm(username, password);
  if (isValid) {
    entries[currentEntryIndx].style.display = "none";
    entries[++currentEntryIndx].style.display = "block";
    error.style.display = "none";
  } else {
    errorVal.innerHTML = "Missing Username or Password";
    error.style.display = "block";
  }
});
