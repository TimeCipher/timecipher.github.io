var formBox = document.getElementById("form-box");
fetch("https://pastebin.com/raw/32FTRSr1")
.then((response) => {
    console.log(response)
    formBox.innerHTML = response
})
.catch((err) => {
    console.log(err);
});