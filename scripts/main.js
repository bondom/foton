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
      const data = obj.document.data.data; // contains array of integers

      const arrayBuffer = new Uint8Array(data).buffer;//converts array of integers to Array Buffer
      const fileContentBase64 = new TextDecoder("utf-8").decode(arrayBuffer);

      
      const documentItemElement = document.createElement('div');
      const link = createLink(obj.document.name, fileContentBase64);
      documentItemElement.appendChild(link);
      if (withDeleteBtn) {
        const deleteBtn = createDeleteButton(obj._id);
        documentItemElement.appendChild(deleteBtn);
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

function createLink(name, base64content) {
  const a = document.createElement('a');
  const linkTextNode = document.createTextNode(name);
  a.appendChild(linkTextNode);
  a.title = `Download ${name}`;
  a.href = `data:application/pdf;base64,${base64content}`;
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