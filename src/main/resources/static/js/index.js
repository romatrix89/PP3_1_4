const url = 'http://localhost:8080/api/users';

const formArticle = document.querySelector('#userModalWindow')
const formNewUser = document.querySelector('#newUserForm')
const allUsersInTheTable = document.querySelector('.table-with-all-users')
const tableUserInfo = document.querySelector('.table-user-info')
const headerBlockPage = document.querySelector('.header-block')
const ulNavBlock = document.querySelector('#myPill')
const modalWindow = new bootstrap.Modal(document.getElementById('userModal'))
const rolesByUser = ["ADMIN", "USER"]

let mapTr = new Map()
let option = ''
let idForm = ''

document.addEventListener('DOMContentLoaded', () => {

    function convertRolesToString(roles) {
        let rolesToString = ''
        let index = 0
        roles.forEach(rolesByUser => {
            if (rolesByUser.name === 'ROLE_ADMIN') {
                rolesToString = 'ADMIN'
            }
            index++
        })
        if (index > 1 && rolesToString === 'ADMIN') {
            rolesToString = rolesToString + ' USER'
        } else if (rolesToString !== 'ADMIN') rolesToString = 'USER'
        return rolesToString
    }

    function renderInputForm(varForm, idValue) {
        let formInputId = document.createElement('input')
        const formLabelId = document.createElement('label')
        let formInputFirstName = document.createElement('input')
        const formLabelFirstName = document.createElement('label')
        let formInputLastName = document.createElement('input')
        const formLabelLastName = document.createElement('label')
        let formInputAge = document.createElement('input')
        const formLabelAge = document.createElement('label')
        let formInputEmail = document.createElement('input')
        const formLabelEmail = document.createElement('label')
        let formInputPassword = document.createElement('input')
        const formLabelPassword = document.createElement('label')
        let formSelectorRoles = document.createElement('select')
        const formLabelRoles = document.createElement('label')
        const divBtn = document.createElement('div')
        const submitBtn = document.createElement('button')
        const closeBtn = document.createElement('button')
        const addBtn = document.createElement('button')

        addBtn.innerHTML = 'Add new user'
        addBtn.className = 'btnAdd btn btn-success'
        addBtn.setAttribute("style", "display: block; margin: 20px auto auto;")
        addBtn.type = "submit"

        divBtn.className = "modal-footer"

        submitBtn.id = "modal-btn"
        submitBtn.type = "submit"
        closeBtn.className = "btn btn-secondary"
        closeBtn.setAttribute("data-dismiss", "modal")
        closeBtn.innerHTML = "Close"

        divBtn.append(closeBtn, submitBtn)

        formLabelId.style.display = "block"
        formLabelId.style.textAlign = "center"
        formLabelFirstName.style.display = "block"
        formLabelFirstName.style.textAlign = "center"
        formLabelLastName.style.display = "block"
        formLabelLastName.style.textAlign = "center"
        formLabelAge.style.display = "block"
        formLabelAge.style.textAlign = "center"
        formLabelEmail.style.display = "block"
        formLabelEmail.style.textAlign = "center"
        formLabelRoles.style.display = "block"
        formLabelRoles.style.textAlign = "center"
        formLabelPassword.style.display = "block"
        formLabelPassword.style.textAlign = "center"
        formLabelId.className = "font-weight-bold"
        formLabelFirstName.className = "font-weight-bold"
        formLabelLastName.className = "font-weight-bold"
        formLabelAge.className = "font-weight-bold"
        formLabelEmail.className = "font-weight-bold"
        formLabelPassword.className = "font-weight-bold"
        formLabelRoles.className = "font-weight-bold"

        formInputId.className = "form-control form-control-modal"
        formInputFirstName.className = "form-control form-control-modal"
        formInputLastName.className = "form-control form-control-modal"
        formInputAge.className = "form-control form-control-modal"
        formInputEmail.className = "form-control form-control-modal"
        formInputPassword.className = "form-control form-control-modal"
        formSelectorRoles.className = "custom-select"

        formInputId.type = "text"
        formInputFirstName.type = "text"
        formInputLastName.type = "text"
        formInputAge.type = "number"
        formInputEmail.type = "text"
        formInputPassword.type = "password"

        formInputId.name = "id"
        formInputFirstName.name = "firstName"
        formInputLastName.name = "lastName"
        formInputAge.name = "age"
        formInputEmail.name = "email"
        formInputPassword.name = "password"

        formInputId.id = idValue + "id"
        formInputFirstName.id = idValue + "firstName"
        formInputLastName.id = idValue + "lastName"
        formInputAge.id = idValue + "age"
        formInputEmail.id = idValue + "email"
        formInputPassword.id = idValue + "password"
        formLabelPassword.id = idValue + "passwordLabel"
        formSelectorRoles.id = idValue + "roles"

        formLabelId.innerHTML = "Id"
        formLabelFirstName.innerHTML = "First name"
        formLabelLastName.innerHTML = "Last name"
        formLabelAge.innerHTML = "Age"
        formLabelEmail.innerHTML = "Email"
        formLabelPassword.innerHTML = "Password"
        formLabelRoles.innerHTML = "Role"

        formSelectorRoles.multiple = true
        for (let i = 0; i < rolesByUser.length; i++) {
            let sel = document.createElement("option");
            sel.textContent = rolesByUser[i];
            sel.value = rolesByUser[i];
            formSelectorRoles.appendChild(sel);
        }

        if (varForm === "formArticle") {
            formArticle.append(formLabelId, formInputId, formLabelFirstName, formInputFirstName, formLabelLastName, formInputLastName,
                formLabelAge, formInputAge, formLabelEmail, formInputEmail, formLabelPassword, formInputPassword,
                formLabelRoles, formSelectorRoles, divBtn)
        }
        if (varForm === "formNewUser") {
            formInputId.className = "form-control"
            formInputFirstName.className = "form-control"
            formInputLastName.className = "form-control"
            formInputAge.className = "form-control"
            formInputEmail.className = "form-control"
            formInputPassword.className = "form-control"
            formSelectorRoles.className = "custom-select custom-select-correct"
            formNewUser.append(formLabelFirstName, formInputFirstName, formLabelLastName, formInputLastName,
                formLabelAge, formInputAge, formLabelEmail, formInputEmail, formLabelPassword, formInputPassword,
                formLabelRoles, formSelectorRoles, addBtn)
        }
    }

    function propertiesInput(property) {
        if (option === "edit") {
            document.getElementById('id').readOnly = true
        }
        document.getElementById('firstName').readOnly = property
        document.getElementById('lastName').readOnly = property
        document.getElementById('age').readOnly = property
        document.getElementById('email').readOnly = property
        document.getElementById('roles').disabled = property
        document.getElementById('password').hidden = property
        document.getElementById('passwordLabel').hidden = property
    }

    function inputValues(user) {
        if (user != null) {
            document.getElementById('id').value = user.id
            document.getElementById('firstName').value = user.firstName
            document.getElementById('lastName').value = user.lastName
            document.getElementById('age').value = user.age
            document.getElementById('email').value = user.email
        } else {
            document.getElementById('id').value = ""
            document.getElementById('firstName').value = ""
            document.getElementById('lastName').value = ""
            document.getElementById('age').value = ""
            document.getElementById('email').value = ""
            document.getElementById('password').value = ""
        }
    }

    function getRolesArray (prefix) {
        let userRoles = []
        const userRolesSelect = document.getElementById(prefix + 'roles')
        if (userRolesSelect.selectedOptions !== undefined) {
            for (let i=0; i < userRolesSelect.selectedOptions.length; i++) {
                if (userRolesSelect.selectedOptions[i].value === "ADMIN") {
                    userRoles.push({"id": 1,
                        "name": "ROLE_ADMIN",
                        "authority": "ROLE_ADMIN"})
                }
                if (userRolesSelect.selectedOptions[i].value === "USER") {
                    userRoles.push({"id": 2,
                        "name": "ROLE_USER",
                        "authority": "ROLE_USER"})
                }
            }
        }
        console.log(userRoles)
        return (userRoles)
    }

    function fetchGetData() {
        fetch(url)
            .then(resp => resp.json())
            .then(data => renderUsers("allUsersInTheTable", data))
    }

    function fetchGetAuthUserData() {
        fetch(url + "auth")
            .then(resp => resp.json())
            .then(data => {
                renderUsersNav(data)
                renderUsers("tableUserInfo", data)
                renderHeader(data)
            })
    }

    function renderUsersNav(authUser) {
        const liAdminUserNav = document.createElement('li')
        const aAdminUserNav = document.createElement('a')
        const liUserNav = document.createElement('li')
        const aUserNav = document.createElement('a')
        const roleAuthUser = convertRolesToString(authUser.roles)

        aAdminUserNav.id = "adminpanel"
        aAdminUserNav.href = "#admin-content"
        aAdminUserNav.setAttribute("data-toggle", "tab")
        aAdminUserNav.setAttribute("role", "tab")
        aAdminUserNav.setAttribute("aria-controls", "#admin-content")
        aAdminUserNav.innerText = "Admin"

        aUserNav.id = "userpanel"
        aUserNav.href = "#user-content"
        aUserNav.setAttribute("data-toggle", "tab")
        aUserNav.setAttribute("role", "tab")
        aUserNav.setAttribute("aria-controls", "#user-content")
        aUserNav.innerText = "User"

        if (roleAuthUser.includes("ADMIN") && roleAuthUser.includes("USER")) {
            liAdminUserNav.className = "nav-item active"
            aAdminUserNav.className = "nav-link active"
            aAdminUserNav.setAttribute("aria-selected", "true")
            liUserNav.className = "nav-item"
            aUserNav.className = "nav-link"
            aUserNav.setAttribute("aria-selected", "false")
            liAdminUserNav.append(aAdminUserNav)
            liUserNav.append(aUserNav)
            ulNavBlock.append(liAdminUserNav, liUserNav)
        }
        if (!roleAuthUser.includes("ADMIN") && roleAuthUser.includes("USER")) {
            document.getElementById("admin-content").style.display = "display: None"
            document.getElementById("admin-content").className = "tab-pane fade"
            document.getElementById("user-content").className = "tab-pane fade show active"
            liUserNav.className = "nav-item active"
            aUserNav.className = "nav-link active"
            aUserNav.setAttribute("aria-selected", "true")
            liUserNav.append(aUserNav)
            ulNavBlock.append(liUserNav)
        }
    }

    function renderHeader(authUser) {
        const headerP = document.createElement('p')
        headerP.className = "font-weight-bold"
        headerP.innerHTML = authUser.email + " with roles: " + convertRolesToString(authUser.roles)
        headerBlockPage.append(headerP)
    }

    function renderUsers(varTable, users) {
        mapTr.clear
        if (varTable === "allUsersInTheTable") {
            for (const user of users) {
                const tableTr = document.createElement('tr')
                const tableTdId = document.createElement('td')
                const tableTdFirstName = document.createElement('td')
                const tableTdLastName = document.createElement('td')
                const tableTdAge = document.createElement('td')
                const tableTdEmail = document.createElement('td')
                const tableTdRoles = document.createElement('td')
                const tableTdBtnEdit = document.createElement('td')
                const editBtn = document.createElement('button')
                const tableTdBtnDelete = document.createElement('td')
                const deleteBtn = document.createElement('button')

                editBtn.innerHTML = 'Edit'
                editBtn.className = 'btnEdit btn btn-info'

                deleteBtn.innerHTML = 'Delete'
                deleteBtn.className = 'btnDelete btn btn-danger'

                tableTr.dataset.id = user.id
                tableTdId.innerHTML = user.id
                tableTdFirstName.innerHTML = user.firstName
                tableTdLastName.innerHTML = user.lastName
                tableTdAge.innerHTML = user.age
                tableTdEmail.innerHTML = user.email
                tableTdRoles.innerHTML = convertRolesToString(user.roles)

                tableTdBtnEdit.append(editBtn)
                tableTdBtnDelete.append(deleteBtn)

                tableTr.append(tableTdId, tableTdFirstName, tableTdLastName, tableTdAge, tableTdEmail, tableTdRoles, tableTdBtnEdit, tableTdBtnDelete)
                allUsersInTheTable.append(tableTr)
                mapTr.set(user.id, tableTr)
            }
        }
        if (varTable === "tableUserInfo") {
            const tableTr = document.createElement('tr')
            const tableTdId = document.createElement('td')
            const tableTdFirstName = document.createElement('td')
            const tableTdLastName = document.createElement('td')
            const tableTdAge = document.createElement('td')
            const tableTdEmail = document.createElement('td')
            const tableTdRoles = document.createElement('td')
            tableTdId.innerHTML = users.id
            tableTdFirstName.innerHTML = users.firstName
            tableTdLastName.innerHTML = users.lastName
            tableTdAge.innerHTML = users.age
            tableTdEmail.innerHTML = users.email
            tableTdRoles.innerHTML = convertRolesToString(users.roles)
            tableTr.append(tableTdId, tableTdFirstName, tableTdLastName, tableTdAge, tableTdEmail, tableTdRoles)
            tableUserInfo.append(tableTr)
        }
    }

    renderInputForm("formArticle", "")
    renderInputForm("formNewUser", "new")
    fetchGetAuthUserData()
    fetchGetData()

    const on = (element, event, selector, handler) => {
        element.addEventListener(event, e => {
            if (e.target.closest(selector)) {
                handler(e)
            }
        })
    }

    on(document, 'click', '.btnDelete', e => {
        option = 'delete'
        const currentUser = e.target.parentNode.parentNode
        idForm = currentUser.children[0].innerHTML
        fetch(url + "/" + idForm)
            .then(response => response.json())
            .then(data => inputValues(data))
            .catch(error => console.log(error))
        propertiesInput(true)
        document.getElementById('modal-btn').className = "btn btn-danger"
        document.getElementById('modal-btn').textContent = "Delete"
        modalWindow.show()
    })

    on(document, 'click', '.btnEdit', e => {
        option = 'edit'
        const currentUser = e.target.parentNode.parentNode
        idForm = currentUser.children[0].innerHTML
        fetch(url + "/" + idForm)
            .then(response => response.json())
            .then(data => inputValues(data))
            .catch(error => console.log(error))
        propertiesInput(false)
        document.getElementById('modal-btn').className = "btn btn-info"
        document.getElementById('modal-btn').textContent = "Edit"
        modalWindow.show()
    })

    formNewUser.addEventListener('submit', (e) => {
        e.preventDefault()
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                "email": document.getElementById('newemail').value,
                "username": document.getElementById('newemail').value,
                "password": document.getElementById('newpassword').value,
                "firstName": document.getElementById('newfirstName').value,
                "lastName": document.getElementById('newlastName').value,
                "age": document.getElementById('newage').value,
                "roles": getRolesArray("new")
            })
        })
            .then(response => {
                response.json()
                if (response.ok) {
                    for (key of mapTr.keys()) {
                        currentTr = mapTr.get(Number(key))
                        currentTr.remove()
                    }
                    fetchGetData()
                }
            })
        document.getElementById('addNewUserTab').className = "nav-link"
        document.getElementById('addNewUserTab').ariaSelected = "false"
        document.getElementById('usersTableTab').className = "nav-link active"
        document.getElementById('usersTableTab').ariaSelected = "true"
        document.getElementById('addnewuser').className = "tab-pane fade"
        document.getElementById('allusers').className = "tab-pane fade active show"
    })

    formArticle.addEventListener('submit', (e) => {
        e.preventDefault()
        let currentTr = mapTr.get(Number(idForm))
        if (option === 'delete') {
            fetch(url + "/" + idForm, {
                method: 'POST'
            })
                .then(currentTr.remove())
            mapTr.delete(currentTr)
        }
        if (option === 'edit') {
             fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    "id": document.getElementById('id').value,
                    "email": document.getElementById('email').value,
                    "username": document.getElementById('email').value,
                    "password": document.getElementById('password').value,
                    "firstName": document.getElementById('firstName').value,
                    "lastName": document.getElementById('lastName').value,
                    "age": document.getElementById('age').value,
                    "roles": getRolesArray("")
                })
            })
                .then(response => {
                    response.json()
                    if (response.ok) {
                        for (key of mapTr.keys()) {
                            currentTr = mapTr.get(Number(key))
                            currentTr.remove()
                        }
                        fetchGetData()
                    }
                })
        }
        modalWindow.hide()
    })
})