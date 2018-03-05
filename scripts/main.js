const API_URL = 'http://77.47.131.170/api/documents';

const mainPage = `Нужна
  1. Главная страничка<br></br>
  2. Страничка контакты<br></br>
  3. Страничка документы<br></br>
  <br></br>
  под разрешение 1024 х 768
  <br></br>
  главная страничка под стиль логотипа (ранее я придумывал что-то вроде симбиоза украинского орнамента и дорожек печатной платы) эскизы были только в бумаге, сейчас не нашел.
  цвета светлые,
  фон ???. переходы по страничкам???? - шрифты??? размер шрифта ??? предложи сам
  <br></br>
  Контакты понятно, они у тебя есть.
  так чтобы было удобно копировать.

  Страничка документы.
  Там будут скан-копии документов.

  Нужно удобство добавления туда новых, удаления старых (несколько раз в год)
  удобство скачивания, мини изображения не нужны просто гипер ссылка (устав, платник ПДВ, всего около 6-7 документов)

  будет лежать на www.foton.kiev.ua.`;

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
  console.log('Loaded');
  const pathname = window.location.pathname.substring(1, window.location.pathname.length);
  handlePageLinkClick(pathname);
};

function handlePageLinkClick(name) {
  history.replaceState({}, name, name);
  replaceContentAndChangeStyles(name, () => loadData(name));
}

function loadData(name) {
  if(name === 'documents') {
  getDocumentsAndInsertIntoDom();
  }
}

function replaceContentAndChangeStyles(name, callback) {
  const mainContent = document.getElementsByClassName('main-content')[0];
    mainContent.style="opacity:0";
    setTimeout(() => {
    mainContent.innerHTML = content[name] || content.main;
    mainContent.style="opacity:1";
    callback();
  }, 300);

  const activeLink = document.getElementsByClassName('nav-item-chosen')[0];
  activeLink.className = activeLink.className.split(' ').filter(cn => cn !== 'nav-item-chosen').join(' ');

  const newActiveLink = document.getElementsByClassName(name)[0] || document.getElementsByClassName('main')[0];
  newActiveLink.className+=' nav-item-chosen';
}

function getDocumentsAndInsertIntoDom(withDeleteBtn = false) {
  const documentsElement = document.getElementsByClassName('documents-list')[0];
  documentsElement.innerHTML="";
  fetch(API_URL, {
    method: 'GET'
  })
  .then(array => array.json())
  .then(array => {
    array.forEach(obj => {
      const dataUrl = obj.document.data; // contains array of integers
      console.log('dataUrl: ' + dataUrl);
      
      const documentItemElement = document.createElement('div');
      documentItemElement.appendChild(createLink(obj.document.name, dataUrl));
      if (withDeleteBtn) {
        documentItemElement.appendChild(createDeleteButton(obj._id));
      }
      documentsElement.appendChild(documentItemElement);
    });
  })
  .catch(err => console.log(err));
};

function deleteDocument(documentId) {
  fetch(API_URL + '/' + documentId, {
    method: 'DELETE'
  })
  .then(doc => {
    console.log('Deleted');
    getDocumentsAndInsertIntoDom(true);
  })
  .catch(err => console.log(err));
}

function createLink(name, dataUrl) {
  const a = document.createElement('a');
  const linkTextNode = document.createTextNode(name);
  a.appendChild(linkTextNode);
  a.title = `Download ${name}`;
  a.href = dataUrl;
  a.download = name;
  return a;
}

function createDeleteButton(documentId) {
  const button = document.createElement('button');
  const buttonTextNode = document.createTextNode('Delete');
  button.appendChild(buttonTextNode);
  button.onclick = () => deleteDocument(documentId);
  return button;
}