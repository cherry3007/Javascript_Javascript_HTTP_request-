const contactList = document.getElementById("contactList");
const nameInput = document.getElementById("name");
const numberInput = document.getElementById("number");
const addButton = document.getElementById("add");

const API_URL = "https://67cafd463395520e6af3e81f.mockapi.io/api/contacts/contacts";

async function fetchContacts() {
    try {
        const response = await fetch(API_URL);
        const contacts = await response.json();
        contactList.innerHTML = "";
        contacts.forEach(contact => {
            renderContact(contact);
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
}

function renderContact(contact) {
    const contactItem = document.createElement("div");
    contactItem.classList.add("contact-item");
    contactItem.innerHTML = `
        <img src="https://via.placeholder.com/40" alt="Avatar" class="avatar">
        <div class="contact-info">
            <strong>${contact.name}</strong>
            <p>${contact.phone || contact.number}</p> <!-- Исправлено -->
        </div>
        <div class="contact-actions">
            <button class="edit" onclick="editContact(${contact.id})">✏️</button>
            <button class="delete" onclick="deleteContact(${contact.id})">🗑️</button>
        </div>
    `;
    contactList.appendChild(contactItem);
}


async function addContact() {
    const name = nameInput.value.trim();
    const number = numberInput.value.trim();
    if (!name || !number) return alert("Please fill in all fields");
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone: number }) // убедись, что API принимает "phone"
        });
        const newContact = await response.json();
        nameInput.value = "";
        numberInput.value = "";
        fetchContacts(); // обновить список после добавления
    } catch (error) {
        console.error("Error adding contact:", error);
    }
}

async function deleteContact(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchContacts();
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}

function editContact(id) {
    const name = prompt("Enter new name:");
    const number = prompt("Enter new number:");
    if (!name || !number) return;
    
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: number })
    })
    .then(response => response.json())
    .then(() => fetchContacts())
    .catch(error => console.error("Error editing contact:", error));
}

addButton.addEventListener("click", addContact);
document.addEventListener("DOMContentLoaded", fetchContacts);