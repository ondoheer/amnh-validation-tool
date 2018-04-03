const hostYesRadio = document.getElementById("host-yes");
const hostNoRadio = document.getElementById("host-no");

hostYesRadio.addEventListener("click", function() {
  const hostSection = document.getElementById("optionalHostInfo");
  hostSection.classList.remove("u-hidden");
});

hostNoRadio.addEventListener("click", function() {
  const hostSection = document.getElementById("optionalHostInfo");
  hostSection.classList.add("u-hidden");
});
