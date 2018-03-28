const hostFoundButton = document.getElementById("hostFound");

hostFoundButton.addEventListener("click", function() {
  const hostSection = document.getElementById("optionalHostInfo");
  hostSection.classList.remove("u-hidden");
});
