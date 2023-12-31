export const openModal = (documentId) => {
    const doc = document.querySelector(documentId);
    doc.style.display = 'flex';
}
export const openModal2 = (documentId) => {
    const doc = document.querySelector(documentId);
    doc.style.display = 'block';
}
export const closeModal = (documentId) => {
    const doc = document.querySelector(documentId);
    doc.style.display = 'none';
}
export const showToastInfo = (msg) => {
    const body = document.querySelector('body');
    const toast = document.createElement('div');
    toast.className = 'info-toast';
    toast.textContent = msg;
    body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}
export const setVisible = (documentId, params) => {
    const doc = document.querySelector(documentId);
    doc.style.display = params ? 'block' : 'none';
}
export const setVisible2 = (documentId, params) => {
    const doc = document.querySelector(documentId);
    doc.style.display = params ? 'flex' : 'none';
}
export const openAcordeon = (documentId) => {
    const doc = document.querySelector(documentId);
    doc.classList.toggle('acordeon-open');
}
export const onlyEnteros = (input) => {
    input.value = input.value.replace(/\D/g, '');
}
export const soloLetras = (event) => {
    var regExp = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g;
    event.target.value = event.target.value.replace(regExp, '');
}
export const soloNumerosDecimales = (event) => {
    var regExp = /[^0-9.]/g;
    event.target.value = event.target.value.replace(regExp, '');
    if ((event.target.value.match(/\./g) || []).length > 1) {
        event.target.value = event.target.value.replace(/\.+$/, "");
    }
}