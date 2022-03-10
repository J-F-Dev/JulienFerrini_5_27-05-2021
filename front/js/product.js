let params = new URL(document.location).searchParams;
let id = params.get("id");

//On crée et on dispatche les éléments
function dispatchValues(v) {
  let itemImg = document.querySelector(".item__img");
  let img = document.createElement("img");
  let title = document.getElementById("title");
  let price = document.getElementById("price");
  let description = document.getElementById("description");
  let colors = document.getElementById("colors");
  let arrayColors = v.colors;

  itemImg.appendChild(img);

  img.src = v.imageUrl;
  title.textContent = v.name;
  price.textContent = v.price;
  description.textContent = v.description;

  for (let i of arrayColors) {
    let option = document.createElement("option");
    colors.appendChild(option);
    option.setAttribute("value", i);
    option.textContent = i;
  }
}

//On vérifie les éléments à envoyer et on envoie
function verifAndSubmit(v) {
  let addToCart = document.getElementById("addToCart");
  let arrayObj = JSON.parse(localStorage.getItem("obj"));
  let blocColor = document.querySelector(".item__content__settings__color");
  let alertColor = document.createElement("p");
  alertColor.style.color = "#a80b00";
  alertColor.style.fontWeight = "bold";
  let blocQuantity = document.querySelector(
    ".item__content__settings__quantity"
  );
  let alertQuantity = document.createElement("p");
  alertQuantity.style.color = "#a80b00";
  alertQuantity.style.fontWeight = "bold";

  //on écoute le click du bouton
  addToCart.addEventListener("click", function (e) {
    e.preventDefault();
    let quantityProduct = document.getElementById("quantity");
    let valueQuantityProduct = quantityProduct.value;
    let valueColors = colors.value;
    let objStorage = {
      id: id,
      color: valueColors,
      quantity: valueQuantityProduct,
    };

    //On vérifie la couleur et la quantité
    if (valueColors == -1) {
      if (blocQuantity.appendChild(alertQuantity)) {
        blocQuantity.removeChild(alertQuantity);
      }
      blocColor.appendChild(alertColor);
      alertColor.textContent = "Merci de choisir une couleur !";
    } else if (valueQuantityProduct > 100 || valueQuantityProduct <= 0) {
      if (blocColor.appendChild(alertColor)) {
        blocColor.removeChild(alertColor);
      }
      blocQuantity.appendChild(alertQuantity);
      alertQuantity.textContent = "Le nombre d'articles est limité à 100 !";
    } else {
      if (blocColor.appendChild(alertColor)) {
        blocColor.removeChild(alertColor);
      }
      if (blocQuantity.appendChild(alertQuantity)) {
        blocQuantity.removeChild(alertQuantity);
      }

      //Si le tableau est créé
      if (arrayObj) {
        let newArticle = true;
        //on parcourt le tableau
        for (let i of arrayObj) {
          //Si les valeurs sont identiques
          if (i.id == id && i.color == valueColors) {
            newArticle = false;
            //on ajoute les quantités
            let nbQ = Number(i.quantity);
            let nbV = Number(valueQuantityProduct);
            i.quantity = nbQ + nbV;
            //Si il y a 100 articles ou moins
            if (Number(i.quantity) <= 100) {
              alert(
                "La quantité du produit " +
                  `${v.name} ` +
                  `(${i.color})` +
                  " a bien été modifiée"
              );
            }

            //si il y a plus de 100 articles
            if (Number(i.quantity) > 100) {
              //on enlève la dernière quantité ajoutée
              i.quantity -= nbV;
              blocQuantity.appendChild(alertQuantity);
              alertQuantity.textContent =
                "Le nombre d'articles dans le panier est limité à 100 !";
            }
            //sinon on ajoute au local storage
            else {
              if (blocQuantity.appendChild(alertQuantity)) {
                blocQuantity.removeChild(alertQuantity);
              }
              localStorage.setItem("obj", JSON.stringify(arrayObj));
            }
          }
        }

        //Si les valeurs ne sont pas identiques
        if (newArticle) {
          //on ajoute l'objet au tableau et le tableau au local storage
          arrayObj.push(objStorage);
          localStorage.setItem("obj", JSON.stringify(arrayObj));
          alert(
            "Le produit " +
              `${v.name} ` +
              `( ${objStorage.color} )` +
              " a bien été ajouté au panier"
          );
        }
      }
      //Sinon si le tableau n'est pas créé
      else {
        //On crée le tableau, on ajoute l'objet au tableau et le tableau au local storage
        arrayObj = [];
        arrayObj.push(objStorage);
        localStorage.setItem("obj", JSON.stringify(arrayObj));
        alert(
          "Le produit " +
            `${v.name} ` +
            `(${objStorage.color})` +
            " a bien été ajouté au panier"
        );
      }
    }

    console.log("OBJET STORAGE :", objStorage);
    console.log("ARRAY STORAGE :", arrayObj);
    console.log("TEST LOCAL :", localStorage.getItem("obj"));
  });
}

//On requête l'api pour récupérer le produit correspondant à l'id
function getValues() {
  fetch(`http://localhost:3000/api/products/${id}`)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {
      let values = value;
      console.log(values);
      dispatchValues(values);
      verifAndSubmit(values);
    })
    .catch(function (err) {
      console.log("Error :", "Merci de démarrer le serveur !");
    });
}

getValues();
