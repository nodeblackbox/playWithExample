const book = "📚";

setInterval(() => {
  var switcher = 1;
  if (!document.title.startsWith(book)) {
    document.title = book + document.title;
    // switcher * -1;
  } else {
    document.title = document.title.replace(book, "");
    // switcher * -1;
  }
  // if ((switcher = 1)) {
  //   console.log("switcher is 1");
  // }
  // if ((switcher = -1)) {
  //   console.log("switcher is -1");
  // }
}, 1000);
