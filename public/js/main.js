const URL = `http://localhost:3000/`;
const REQUEST_HEADERS_JSON_TYPE = {
    "Accept": "application/json",
    "Content-Type": "application/json"
};

//#region Front-End purpose only, Not related to Node/Express/Mongo __start

// Front-End form fields validation
function validate(type, value) {
    const REGEX = {
        name: "^[a-zA-Z\s]*$",
        email: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        mobile: "^([6-9]{1})([0-9]{9})$"
    }
    if (REGEX[type] && value) {
        let validationRegex = new RegExp(REGEX[type]);
        return validationRegex.test(value);
    } else {
        return false;
    }
}

// Close modal: [Written function as modal to be closed after update, delete etc.]
function closeModal() {
    document.body.classList.remove('modal-open');
}

document.getElementById('closeModal').addEventListener('click', () => {
    closeModal();
});


// Reset form: [Written function as after clicking on CTA fields should clear.]
function resetForm() {
    document.getElementById('name').value = null;
    document.getElementById('email').value = null;
    document.getElementById('mobile').value = null;
}

document.getElementById('reset').addEventListener('click', function () {
    resetForm();
});

function insertContact(data, fetchAll) {
    if (data && data.length) {
        let _fragment = new DocumentFragment();
        data.forEach(function (contact) {
            let _tr = document.createElement('tr'),
                _nameTd = document.createElement('td'),
                _emailTd = document.createElement('td'),
                _mobileTd = document.createElement('td'),
                _actionsTd = document.createElement('td'),
                _editBtn = document.createElement('button'),
                _deleteBtn = document.createElement('button'),
                { _id: id, name, email, mobile } = contact;

            _tr.setAttribute('data-cid', id);

            _nameTd.textContent = name || 'UNAVAILABLE';
            _emailTd.textContent = email || 'UNAVAILABLE';
            _mobileTd.textContent = mobile || 'UNAVAILABLE';

            _editBtn.textContent = 'Edit';
            _editBtn.className = 'button';
            _editBtn.onclick = function () {
                console.log('Edit ', contact);
                document.getElementById('modalId').value = id;
                document.getElementById('modalName').value = name;
                document.getElementById('modalName').removeAttribute('readonly');
                document.getElementById('modalEmail').value = email;
                document.getElementById('modalEmail').removeAttribute('readonly');
                document.getElementById('modalMobile').value = mobile;
                document.getElementById('modalMobile').removeAttribute('readonly');

                document.getElementById('modalTitle').innerText = "Edit contact";
                document.getElementById('modalTitle').removeAttribute('title-msg');
                document.getElementById('fullContactModal').setAttribute('modal-action', 'edit');
                document.body.classList.add('modal-open');
            }

            _deleteBtn.textContent = 'Delete';
            _deleteBtn.className = 'button button-secondary';
            _deleteBtn.onclick = function () {
                console.log('Delete ', contact);
                document.getElementById('modalId').value = id;
                document.getElementById('modalName').value = name;
                document.getElementById('modalName').setAttribute('readonly', 'readonly');
                document.getElementById('modalEmail').value = email;
                document.getElementById('modalEmail').setAttribute('readonly', 'readonly');
                document.getElementById('modalMobile').value = mobile;
                document.getElementById('modalMobile').setAttribute('readonly', 'readonly');

                document.getElementById('modalTitle').innerText = "Delete contact";
                document.getElementById('modalTitle').setAttribute('title-msg', 'Contact will be deleted permanently.');
                document.getElementById('fullContactModal').setAttribute('modal-action', 'delete');
                document.body.classList.add('modal-open');
            }

            _actionsTd.appendChild(_editBtn);
            _actionsTd.appendChild(_deleteBtn);


            _tr.appendChild(_nameTd);
            _tr.appendChild(_emailTd);
            _tr.appendChild(_mobileTd);
            _tr.appendChild(_actionsTd);

            _fragment.appendChild(_tr);
        });

        if (!fetchAll) {
            document.getElementById('contactsList').innerHTML = null;
        }
        document.getElementById('contactsList').appendChild(_fragment);
    }
}

document.getElementById('fetchContacts').click();
//#endregion Front-End purpose only, Not related to Node/Express/Mongo __start
//###

//#region CREATE Contact: POST API '/contact' __start
document.getElementById('addContact').addEventListener('click', () => {
    let name = document.getElementById('name').value,
        email = document.getElementById('email').value,
        mobile = document.getElementById('mobile').value;

    if (validate('name', name) && validate('email', email) && validate('mobile', mobile)) {
        let contact = { name, email, mobile }

        const opts = {
            method: 'POST',
            headers: REQUEST_HEADERS_JSON_TYPE,
            body: JSON.stringify(contact)
        };

        fetch(URL + 'contact', opts).then(res => res.json()).then((data) => {
            console.log('DATA :: ', data);
            let dataArr = [];
            dataArr.push(data);
            insertContact(dataArr, true);
            resetForm();
        }).catch(err => {
            console.log('ERROR :: ', err);
        });
    } else {
        alert('Please enter valid name/email/mobile no.!')
    }
});
//#endregion Create Contact: POST API '/contact' __end
//###

//#region RETREIVE Contacts: GET API '/contact' __start
document.getElementById('fetchContacts').addEventListener('click', () => {
    const opts = {
        method: 'GET',
        headers: REQUEST_HEADERS_JSON_TYPE
    };

    fetch(URL + 'contact', opts).then(res => res.json()).then((data) => {
        console.log('DATA :: ', data);
        //#region DOM Row Creation -- [Normal JavaScript only, not related to Node/Express/Mongo]
        insertContact(data);
        //#endregion DOM Row Creation
    }).catch(err => {
        console.log('ERROR :: ', err);
    });
});
//#endregion Fetch Contacts: GET API '/contact' __end
//###

//#region UPDATE Contact: UPDATE API '/contact' __start
document.getElementById('updateContact').addEventListener('click', () => {
    let id = document.getElementById('modalId').value;

    if (id) {
        let name = document.getElementById('modalName').value,
            email = document.getElementById('modalEmail').value,
            mobile = document.getElementById('modalMobile').value;

        if (validate('name', name) && validate('email', email) && validate('mobile', mobile)) {
            let contact = { name, email, mobile }
            const opts = {
                method: 'PUT',
                headers: REQUEST_HEADERS_JSON_TYPE,
                body: JSON.stringify(contact)
            };

            let _contactSeletor = '[data-cid="' + id + '"]';
            document.querySelector(_contactSeletor).classList.add('record-updated');

            fetch(URL + 'contact/' + id, opts).then(res => res.json()).then((data) => {
                console.log('DATA :: ', data);
                let { name, email, mobile } = data;

                let tableData = document.querySelectorAll(_contactSeletor + ' td');
                
                tableData[0].textContent = name;
                tableData[1].textContent = email;
                tableData[2].textContent = mobile;

                closeModal();
                setTimeout(function () {
                    document.querySelector(_contactSeletor).classList.remove('record-updated');
                }, 1500);
            }).catch(err => {
                console.log('ERROR :: ', err);
            });
        } else {
                alert('Please enter valid name/email/mobile no.!')
            }
        } else {
            alert('Contact not available for updation!')
        }
    });
//#endregion Create Contact: POST API '/contact' __end
//###

//#region DELETE Contact: DELETE API '/contact' __start
document.getElementById('deleteContact').addEventListener('click', () => {
    let id = document.getElementById('modalId').value;

    if (id) {
        const opts = {
            method: 'DELETE'
        };

        document.querySelector('[data-cid="' + id + '"]').classList.add('ready-for-deletion');

        fetch(URL + 'contact/' + id, opts).then(res => res.json()).then((data) => {
            console.log('DATA :: ', data);
            closeModal();
            setTimeout(function () {
                document.querySelector('[data-cid="' + id + '"]').remove();
            }, 1500);
        }).catch(err => {
            console.log('ERROR :: ', err);
        });
    } else {
        alert('Contact not available for deletion!')
    }
});
//#endregion Create Contact: POST API '/contact' __end
//###