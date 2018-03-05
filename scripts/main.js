const API_URL = 'http://77.47.131.170/api/documents';

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