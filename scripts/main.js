const API_URL = "http://77.47.131.170/api/documents";

const mainPage = `
<p><b>ТОВ "НВП "Фотон"</b> надає повний спектр послуг з розробки, 
виробництва, продажу, монтажу, ремонту і технічного обслуговування 
радіоелектронної апаратури, засобів зв'язку, систем безпеки, 
медичного обладнання, відео- і телеапаратури, комп'ютерної техніки, 
вимірювальних приладів та інших спеціальних засобів і засобів загального призначення.</p> 
<p><b>ТОВ "НВП "Фотон"</b> має понад 20 висококваліфікованих фахівців, які мають великий досвід у науковій, 
інженерній та виробничій діяльності з радіотехніці. 
Їх наукові дослідження, підтверджені конкретними завершеними проектами, 
які регулярно публікуються в таких спеціалізованих виданнях, як <b>"Правове, 
нормативне та метрологічне забезпечення системи захисту інформації в Україні"</b>, 
<b>"Фотон-експрес"</b> та інших. Компанія має свої виробничі потужності, оснащені сучасним обладнанням, 
що дозволяє вирішувати технічні проблеми будь-якої складності.</p>`;

const contactsPage = `
  <h4>ТОВ “Науково-виробниче підприємство “Фотон”<br></br></h4>
  03680, м. Київ, вул. Академіка Кримського, 27а, оф. 212<br></br> 
  р/р 26005052624186 в ПАТ КБ "Приватбанк" м. Києва,<br></br>
  ЄДРПОУ 23521196, МФО 320649, СПП №36377814,<br></br>
  ІПН 235211926547, 204-92-80, 204-83-85, 422-89-22<br></br>
  e-mail: <a href="mailto:dr0nt@ukr.net">dr0nt@ukr.net</a> <a href="http://foton.kiev.ua" target="_self">www.foton.kiev.ua</a>
`;

const documentsPage = `
  Документы
  <br></br>
  <div class="documents-list"></div>
`;

const content = {
  main: mainPage,
  contacts: contactsPage,
  documents: documentsPage
};

window.onload = function() {
  console.log("Loaded");
  const pathname = window.location.pathname.substring(
    1,
    window.location.pathname.length
  );
  handlePageLinkClick(pathname);
};

function handlePageLinkClick(name) {
  history.replaceState({}, name, name);
  replaceContentAndChangeStyles(name, () => loadData(name));
}

function loadData(name) {
  if (name === "documents") {
    getDocumentsAndInsertIntoDom();
  }
}

function replaceContentAndChangeStyles(name, callback) {
  const mainContent = document.getElementsByClassName("main-content")[0];
  mainContent.style = "opacity:0";
  setTimeout(() => {
    mainContent.innerHTML = content[name] || content.main;
    mainContent.style = "opacity:1";
    callback();
  }, 300);

  const activeLink = document.getElementsByClassName("nav-item-chosen")[0];
  activeLink.className = activeLink.className
    .split(" ")
    .filter(cn => cn !== "nav-item-chosen")
    .join(" ");

  const newActiveLink =
    document.getElementsByClassName(name)[0] ||
    document.getElementsByClassName("main")[0];
  newActiveLink.className += " nav-item-chosen";
}

function getDocumentsAndInsertIntoDom(withDeleteBtn = false) {
  const documentsElement = document.getElementsByClassName("documents-list")[0];
  documentsElement.innerHTML = "";
  fetch(API_URL, {
    method: "GET"
  })
    .then(array => array.json())
    .then(array => {
      array.forEach(obj => {
        const dataUrl = obj.document.data; // contains array of integers

        const documentItemElement = document.createElement("div");
        documentItemElement.appendChild(createLink(obj.document.name, dataUrl));
        if (withDeleteBtn) {
          documentItemElement.appendChild(createDeleteButton(obj._id));
        }
        documentsElement.appendChild(documentItemElement);
      });
    })
    .catch(err => console.log(err));
}

function deleteDocument(documentId) {
  fetch(API_URL + "/" + documentId, {
    method: "DELETE"
  })
    .then(doc => {
      console.log("Deleted");
      getDocumentsAndInsertIntoDom(true);
    })
    .catch(err => console.log(err));
}

function createLink(name, dataUrl) {
  const a = document.createElement("a");
  const linkTextNode = document.createTextNode(name);
  a.appendChild(linkTextNode);
  a.title = `Download ${name}`;
  a.href = dataUrl;
  a.download = name;
  return a;
}

function createDeleteButton(documentId) {
  const button = document.createElement("button");
  const buttonTextNode = document.createTextNode("Delete");
  button.appendChild(buttonTextNode);
  button.onclick = () => deleteDocument(documentId);
  return button;
}
