const star = "🖤";

setInterval(() => {
  if (!document.title.startsWith(star)) document.title = star + document.title;
  else document.title = document.title.replace(star, "");
}, 1000);
