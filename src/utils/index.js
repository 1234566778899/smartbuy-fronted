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