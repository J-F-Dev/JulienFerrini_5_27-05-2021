//On crée une boucle qui récupére les éléments et les dispatche
function dispatchValues(values) {
  for (let i of values) {
    let items = document.getElementById("items");
    let a = document.createElement("a");
    let article = document.createElement("article");
    let img = document.createElement("img");
    let h3 = document.createElement("h3");
    h3.classList.add("productName");
    let p = document.createElement("p");
    p.classList.add("productDescription");

    items.appendChild(a);
    a.appendChild(article);
    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(p);

    a.href = `product.html?id=${i._id}`;
    img.src = i.imageUrl;
    img.setAttribute("alt", i.altTxt);
    h3.textContent = i.name;
    p.textContent = i.description;
  }
}

//On requête l'api pour lui demander l'ensemble des produits
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    let values = value;
    console.log(values);
    dispatchValues(values);
  })
  .catch(function (err) {
    console.log("Error :", "Merci de démarrer le serveur !");
  });
