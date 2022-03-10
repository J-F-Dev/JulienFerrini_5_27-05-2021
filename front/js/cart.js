//si on est sur la page confirmation
if (window.location == "http://127.0.0.1:5500/front/html/confirmation.html") {
  //On récupére le numéro, on l'affiche et on le supprime du local storage
  function getConfirmation() {
    let confirmation = document.getElementById("orderId");
    confirmation.textContent = localStorage.getItem("orderId");
    localStorage.clear();
  }

  getConfirmation();
}
//Si on ne se trouve pas sur la page de confirmation
else {
  let arrayObj = JSON.parse(localStorage.getItem("obj"));
  let tQ = 0;
  let tE = 0;
  let arrayProduct = [];

  //On crée et on dispatche les éléments
  function dispatchValues(p, x, v) {
    let cartItems = document.getElementById("cart__items");

    let article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", `${p}`);
    cartItems.appendChild(article);

    let divImg = document.createElement("div");
    divImg.classList.add("cart__item__img");
    article.appendChild(divImg);
    let img = document.createElement("img");
    img.src = v.imageUrl;
    img.setAttribute("alt", v.altTxt);
    divImg.appendChild(img);

    let divContent = document.createElement("div");
    divContent.classList.add("cart__item__content");
    article.appendChild(divContent);

    let divContentTitlePrice = document.createElement("div");
    divContentTitlePrice.classList.add("cart__item__content__titlePrice");
    divContent.appendChild(divContentTitlePrice);

    let contentTitle = document.createElement("h2");
    contentTitle.textContent = v.name + " (" + x.color + ")";
    divContentTitlePrice.appendChild(contentTitle);

    let contentPrice = document.createElement("p");
    contentPrice.textContent = v.price + "€";
    divContentTitlePrice.appendChild(contentPrice);

    let divContentSettings = document.createElement("div");
    divContentSettings.classList.add("cart__item__content__settings");
    divContent.appendChild(divContentSettings);

    let divContentSettingsQuantity = document.createElement("div");
    divContentSettingsQuantity.classList.add(
      "cart__item__content__settings__quantity"
    );
    divContentSettings.appendChild(divContentSettingsQuantity);

    let settingsQuantity = document.createElement("p");
    settingsQuantity.textContent = "Quantité : " + x.quantity;
    divContentSettingsQuantity.appendChild(settingsQuantity);

    let settingsInput = document.createElement("input");
    settingsInput.classList.add("itemQuantity");
    settingsInput.setAttribute("type", "number");
    settingsInput.setAttribute("name", "itemQuantity");
    settingsInput.setAttribute("min", "1");
    settingsInput.setAttribute("max", "100");
    settingsInput.setAttribute("value", `${x.quantity}`);
    divContentSettingsQuantity.appendChild(settingsInput);

    let divContentSettingsDelete = document.createElement("div");
    divContentSettingsDelete.classList.add(
      "cart__item__content__settings__delete"
    );
    divContentSettings.appendChild(divContentSettingsDelete);

    let settingsDelete = document.createElement("p");
    settingsDelete.classList.add("deleteItem");
    settingsDelete.textContent = "Supprimer";
    divContentSettingsDelete.appendChild(settingsDelete);

    //On écoute le changement des quantités
    settingsInput.addEventListener("change", function (e) {
      //on modifie la quantité affichée
      tQ -= x.quantity;
      tE -= Number(x.quantity) * Number(v.price);
      x.quantity = e.target.value;
      localStorage.setItem("obj", JSON.stringify(arrayObj));
      settingsQuantity.textContent = "Quantité : " + x.quantity;
      //On modifie la quantité totale affichée
      let totalQuantity = document.getElementById("totalQuantity");
      tQ += Number(x.quantity);
      totalQuantity.textContent = tQ;
      //On modifie le prix total affiché
      let totalPrice = document.getElementById("totalPrice");
      let sum = Number(x.quantity) * Number(v.price);
      tE += sum;
      totalPrice.textContent = tE;
    });

    //on écoute le click de la suppression
    settingsDelete.addEventListener("click", function (e) {
      let id = article.dataset.id;
      let color = x.color;
      //On récupére la position de l'objet dans le tableau
      let position = arrayObj.findIndex(
        (product) => product.id === id && product.color === color
      );
      //on supprime l'objet du tableau
      arrayObj.splice(position, 1);
      console.log("CLIIIIIIICK", color);
      localStorage.setItem("obj", JSON.stringify(arrayObj));
      location.reload();
    });
  }

  //On trouve la quantité totale
  function totalQ(q) {
    let totalQuantity = document.getElementById("totalQuantity");

    tQ += Number(q.quantity);
    totalQuantity.textContent = tQ;
  }

  //on trouve le prix total
  function totalE(x, v) {
    let totalPrice = document.getElementById("totalPrice");
    let sum = Number(x.quantity) * Number(v.price);
    tE += sum;
    totalPrice.textContent = tE;
  }

  //on valide le panier avec les informations client
  function submitValues(p) {
    let order = document.getElementById("order");
    const firstName = document.getElementById("firstName");
    let firstNameErr = document.getElementById("firstNameErrorMsg");
    let lastName = document.getElementById("lastName");
    let lastNameErr = document.getElementById("lastNameErrorMsg");
    let address = document.getElementById("address");
    let addressErr = document.getElementById("addressErrorMsg");
    let city = document.getElementById("city");
    let cityErr = document.getElementById("cityErrorMsg");
    let email = document.getElementById("email");
    let emailErr = document.getElementById("emailErrorMsg");
    let isValidFirstName = false;
    let isValidLastName = false;
    let isValidAddress = false;
    let isValideCity = false;
    let isValidEmail = false;
    let regName = /^[a-zA-Z\-]{2,}$/;
    let regAddress = /^[a-zA-Z0-9\s,.'-]{3,}$/;
    let regCity = /^[a-zA-Z\éàè-]{2,}$/;
    let regEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //on crée les fonctions de vérifications grâce aux regex de Firstname/Lastname/Address/City/Email
    function validFirstName(value) {
      if (regName.test(value)) {
        firstNameErr.textContent = "Prénom valide";
        firstNameErr.style.color = "#5fdb39";
        firstNameErr.style.fontWeight = "bold";
        isValidFirstName = true;
      } else {
        firstNameErr.textContent = "Prénom invalide";
        firstNameErr.style.color = "#a80b00";
        firstNameErr.style.fontWeight = "bold";
        isValidFirstName = false;
      }
    }
    function validLastName(value) {
      if (regName.test(value)) {
        lastNameErr.textContent = "Nom valide";
        lastNameErr.style.color = "#5fdb39";
        lastNameErr.style.fontWeight = "bold";
        isValidLastName = true;
      } else {
        lastNameErr.textContent = "Nom invalide";
        lastNameErr.style.color = "#a80b00";
        lastNameErr.style.fontWeight = "bold";
        isValidLastName = false;
      }
    }
    function validAddress(value) {
      if (regAddress.test(value)) {
        addressErr.textContent = "Adresse valide";
        addressErr.style.color = "#5fdb39";
        addressErr.style.fontWeight = "bold";
        isValidAddress = true;
      } else {
        addressErr.textContent = "Adresse invalide";
        addressErr.style.color = "#a80b00";
        addressErr.style.fontWeight = "bold";
        isValidAddress = false;
      }
    }
    function validCity(value) {
      if (regCity.test(value)) {
        cityErr.textContent = "Ville valide";
        cityErr.style.color = "#5fdb39";
        cityErr.style.fontWeight = "bold";
        isValideCity = true;
      } else {
        cityErr.textContent = "Ville invalide";
        cityErr.style.color = "#a80b00";
        cityErr.style.fontWeight = "bold";
        isValideCity = false;
      }
    }
    function validEmail(value) {
      if (regEmail.test(value)) {
        emailErr.textContent = "Email valide";
        emailErr.style.color = "#5fdb39";
        emailErr.style.fontWeight = "bold";
        isValidEmail = true;
      } else {
        emailErr.textContent = "Email invalide";
        emailErr.style.color = "#a80b00";
        emailErr.style.fontWeight = "bold";
        isValidEmail = false;
      }
    }

    //On écoute le changement de Firstname/Lastname/Address/City/Email
    firstName.addEventListener("input", function (e) {
      validFirstName(e.target.value);
    });

    lastName.addEventListener("input", function (e) {
      validLastName(e.target.value);
    });

    address.addEventListener("input", function (e) {
      validAddress(e.target.value);
    });

    city.addEventListener("input", function (e) {
      validCity(e.target.value);
    });

    email.addEventListener("input", function (e) {
      validEmail(e.target.value);
    });
    //On écoute le click du bouton
    order.addEventListener("click", function (e) {
      validFirstName(firstName.value);
      validLastName(lastName.value);
      validAddress(address.value);
      validCity(city.value);
      validEmail(email.value);
      e.preventDefault();

      //Si la vérification est ok
      if (
        isValidFirstName &&
        isValidLastName &&
        isValidAddress &&
        isValideCity &&
        isValidEmail
      ) {
        //On ajoute l'id des produits au tableau arrayProduct
        arrayProduct.push(p);
        console.log(arrayProduct);
        //Si le nombre d'élément dans le tableau arrayProduct est identique aux nombres d'éléments dans arrayobj
        if (arrayProduct.length == arrayObj.length) {
          //on crée l'objet, la partie contact et la partie produit
          let productContact = {
            contact: {
              firstName: firstName.value,
              lastName: lastName.value,
              address: address.value,
              city: city.value,
              email: email.value,
            },
            products: arrayProduct,
          };
          console.log("TEST PRODUCT :", JSON.stringify(productContact));

          //On effectue une requête post à l'api
          fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },

            body: JSON.stringify(productContact),
          })
            .then(function (res) {
              if (res.ok) {
                return res.json();
              }
              console.log(res);
            })
            .then(function (data) {
              //on récupére les données
              console.log("TEST DATA :", data);
              //On supprime le local storage existant
              localStorage.clear();
              //on envoie au local storage le numéro client
              localStorage.setItem("orderId", data.orderId);
              //on change de page pour aller sur confirmation.html
              document.location.href = "confirmation.html";
            })
            .catch(function (err) {
              console.log("Error :", "Merci de démarrer le serveur !");
            });

          console.log("TEEEEEESTTTT :", productContact);
        }
      } else {
        console.log("ERRRRRRR");
      }
    });
  }

  //On requête l'api pour récupérer le produit correspondant à l'id
  function getValues(p, i) {
    fetch(`http://localhost:3000/api/products/${p}`)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (value) {
        let values = value;

        dispatchValues(p, i, values);
        totalQ(i);
        totalE(i, values);
      })
      .catch(function (err) {
        console.log("Error :", "Merci de démarrer le serveur !");
      });
  }

  //On crée une boucle qui récupére les éléments
  for (let i of arrayObj) {
    let productId = i.id;

    getValues(productId, i);
    submitValues(productId);
  }
}
