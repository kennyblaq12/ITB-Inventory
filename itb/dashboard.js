const popup = document.getElementById("popup");
const addBtns = document.getElementsByClassName(".add_btn");

addBtns.addEventListener("click", () => {
  popup.style.display = "block";
});

document
  .getElementById("addNewAssetBtn")
  .addEventListener("click", function () {
    document.getElementById("popup").style.display = "block";
  });

// Optional: Close popup when clicking outside of the form
window.addEventListener("click", function (e) {
  const popup = document.getElementById("popup");
  const form = document.querySelector(".info");

  if (e.target === popup) {
    popup.style.display = "none";
  }
});
