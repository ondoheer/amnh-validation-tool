import errorsList from "./errors";

const user = sessionStorage.getItem("userName");

if (!user) {
  sessionStorage.setItem("longFormNoUserError", errorsList.longFormNoUserName);
  const nextLink = document.getElementById("next").href;

  window.location = nextLink;
} else {
  const userTag = document.getElementById("userName");
  userTag.innerHTML = user;
}
