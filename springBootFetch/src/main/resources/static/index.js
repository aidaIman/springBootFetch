$(async function () {
    await getTableWithUsers();
    await getNewUserForm();
    await getDefaultModal();
    await addNewUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;utf-8',
        'Referer': null
    },
    findAllUsers: async () => await fetch('http://localhost:8181/api/users'),
    findAllRoles: async () => await fetch('http://localhost:8181/api/roles'),
    findOneUser: async (id) => await fetch(`http://localhost:8181/api/${id}`),

    addNewUser: async (user) => await fetch('http://localhost:8181/api/', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`http://localhost:8181/api/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (user, id) => await fetch(`http://localhost:8181/api/${id}`, {
        method: 'DELETE',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    })
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                table.append($('<tr class="border-top bg-light">').attr('id', 'userRow[' + user.id + ']')
                    .append($('<td>').attr('id', 'userData[' + user.id + '][id]').text(user.id))
                    .append($('<td>').attr('id', 'userData[' + user.id + '][id]').text(user.username))
                    .append($('<td>').attr('id', 'userData[' + user.id + '][firstName]').text(user.firstName))
                    .append($('<td>').attr('id', 'userData[' + user.id + '][lastName]').text(user.lastName))
                    .append($('<td>').attr('id', 'userData[' + user.id + '][age]').text(user.phoneNumber))
                    .append($('<td>').attr('id', 'userData[' + user.id + '][email]').text(user.email))
                    .append($('<td>').attr('id', 'userData[' + user.id + '][roles]').text(user.roles.map(role => role.roleName)))

                    //обработчик клика на кнопке Edit в таблице юзеров c показом формы
                    .append($('<td>').append($('<button type="button" data-getUserWithId="' + user.id +
                        '" data-action="edit" class="btn btn-info" data-toggle="modal" data-target="#someDefaultModal">')
                        .text('Edit')))

                    //обработчик клика на кнопке Delete в таблице юзеров c показом формы
                    .append($('<td>').append($('<button type="button" data-getUserWithId="' + user.id +
                        '" data-action="delete" class="btn btn-danger" data-toggle="modal" data-target="#someDefaultModal">')
                        .text('Delete')))
                );
            })
        })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-getUserWithId');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-getUserWithId', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getNewUserForm() {
   // let button = $(`#SliderNewUserForm`);
    let form = $(`#defaultSomeForm`)
    form.show();
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userWithId = thisModal.attr('data-getUserWithId');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userWithId);
                break;
            case 'delete':
                deleteUser(thisModal, userWithId);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let userForEdit = await userFetchService.findOneUser(id);
    let userAllRoles = await userFetchService.findAllRoles();

    let user = userForEdit.json();
    let roles = userAllRoles.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  type="button" class="btn btn-primary" id="editButton">Edit</button>`;
    let closeButton = `<button form="editUser" type="submit" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`

    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        roles.then(roles => {
            let bodyForm = `
            <form class="form-group" id="editUser">
            
                <label for="editId" class="form-label ">ID</label>
                <input type="text" class="form-control" id="editId" name="id" value="${user.id}" disabled><br>

                
                <label for="editPassword" class="form-label ">Password</label>
                <input type="password" class="form-control" id="editPassword" name="password" value="${user.password}"><br>
                
                <label for="editFirstName" class="form-label ">First Name</label>
                <input type="text" class="form-control" id="editFirstName" name="firstName" value="${user.firstName}"><br>
                
                <label for="editLastName" class="form-label ">Last Name</label>
                <input type="text" class="form-control" id="editLastName" name="lastName" value="${user.lastName}"><br>
                
                <label for="editPhoneNumber" class="form-label ">Phone Number</label>
                <input type="text" class="form-control" id="editPhoneNumber" name="phoneNumber" value="${user.phoneNumber}"><br>
                
                <label for="editEmail" class="form-label ">Email</label>
                <input type="text" class="form-control" id="editEmail" name="email" value="${user.email}"><br>
                
                <label for="editRoles">Roles</label>
                <select multiple size=${roles.length} name="roles"
                 class="form-control" id="editRoles" style="text-align:left;">
                 ${roles.map(function (role) {
                return `<option value="${role.roleName}">${role.roleName}</option>`
            })}
                </select>
                <br/>
                </label>
                
            </form>
        `;
            modal.find('.modal-body').append(bodyForm);
        })
    })
    $("#editButton").on('click', async () => {
        let id = modal.find("#editId").val().trim();
        let password = modal.find("#editPassword").val().trim();
        let firstName = modal.find("#editFirstName").val().trim();
        let lastName = modal.find("#editLastName").val().trim();
        let phoneNumber = modal.find("#editPhoneNumber").val().trim();
        let email = modal.find("#editEmail").val().trim();
        let rolesUser = modal.find("#editRoles").val();
        let data;
        if (rolesUser.length > 1) {
            const [firstRole, secondRole] = rolesUser;
            data = {
                id: id,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                roles: [
                    {
                        id: 0,
                        roleName: String(firstRole),
                        users: null
                    },
                    {
                        id: 1,
                        roleName: String(secondRole),
                        users: null
                    }
                ]
            }
        } else {
            data = {
                id: id,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                roles: [
                    {
                        id: 0,
                        roleName: String(rolesUser),
                        users: null
                    }
                ]
            }
        }

        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            await getTableWithUsers();
            modal.modal('hide');
            $('#userData\\[' + data.id + '\\]\\[username\\]').text(data.username)
            $('#userData\\[' + data.id + '\\]\\[firstName\\]').text(data.firstName)
            $('#userData\\[' + data.id + '\\]\\[lastName\\]').text(data.lastName)
            $('#userData\\[' + data.id + '\\]\\[phoneNumber\\]').text(data.phoneNumber)
            $('#userData\\[' + data.id + '\\]\\[email\\]').text(data.email)
            $('#userData\\[' + data.id + '\\]\\[roles\\]').text(data.roles.map(role => role.roleName));

        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function deleteUser(modal, id) {
    let userForDelete = await userFetchService.findOneUser(id);
    let userAllRoles = await userFetchService.findAllRoles();

    let user = userForDelete.json();
    let roles = userAllRoles.json();

    modal.find('.modal-title').html('Delete user');

    let deleteButton = `<button  type="button" class="btn btn-danger" id="deleteButton">delete</button>`;
    let closeButton = `<button form="deleteUser" type="submit" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`

    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        roles.then(roles => {
            let bodyForm = `
            <form class="form-group" id="deleteUser">
            
                <label for="deleteId" class="form-label ">ID</label>
                <input type="text" class="form-control" id="deleteId" name="id" value="${user.id}" disabled><br>
                
                <label for="deleteUsername" class="form-label ">Username</label>
                <input type="text" class="form-control" id="deleteUsername" name="username" value="${user.username}" disabled><br>
                
                
                <label for="deleteFirstName" class="form-label ">First Name</label>
                <input type="text" class="form-control" id="deleteFirstName" name="firstName" value="${user.firstName}" disabled><br>
                
                <label for="deleteLastName" class="form-label ">Last Name</label>
                <input type="text" class="form-control" id="deleteLastName" name="lastName" value="${user.lastName}" disabled><br>
                
                <label for="deletePhoneNumber" class="form-label ">Phone Number</label>
                <input type="text" class="form-control" id="deletePhoneNumber" name="phoneNumber" value="${user.phoneNumber}" disabled><br>
                
                <label for="deleteEmail" class="form-label ">Email</label>
                <input type="text" class="form-control" id="deleteEmail" name="email" value="${user.email}" disabled><br>
                
                <label for="deleteRoles">Roles</label>
                <select multiple size=${roles.length} name="roles" 
                 class="form-control" id="deleteRoles" style="text-align:left;" disabled>
                 ${roles.map(function (role) {
                return `<option value="${role.roleName}">${role.roleName}</option>`
            })} 
                </select>
                <br/>
                </label>
                
            </form>
        `;
            modal.find('.modal-body').append(bodyForm);
        })
    })
    $("#deleteButton").on('click', async () => {
        let id = modal.find("#deleteId").val().trim();
        let username = modal.find("#deleteUsername").val().trim();
        let firstName = modal.find("#deleteFirstName").val().trim();
        let lastName = modal.find("#deleteLastName").val().trim();
        let phoneNumber = modal.find("#deletePhoneNumber").val().trim();
        let email = modal.find("#deleteEmail").val().trim();
        let rolesUser = modal.find("#deleteRoles").val();
        let data;
        if (rolesUser.length > 1) {
            const [firstRole, secondRole] = rolesUser;
            data = {
                id: id,
                username: username,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                roles: [
                    {
                        id: 0,
                        roleName: String(firstRole),
                        users: null
                    },
                    {
                        id: 1,
                        roleName: String(secondRole),
                        users: null
                    }
                ]
            }
        } else {
            data = {
                id: id,
                username: username,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                roles: [
                    {
                        id: 0,
                        roleName: String(rolesUser),
                        users: null
                    }
                ]
            }
        }


    const response = await userFetchService.deleteUser(data, id);

    if (response.ok) {
        await getTableWithUsers();
        modal.modal('hide');
        $('#userData\\[' + data.id + '\\]\\[username\\]').text(data.username)
        $('#userData\\[' + data.id + '\\]\\[firstName\\]').text(data.firstName)
        $('#userData\\[' + data.id + '\\]\\[lastName\\]').text(data.lastName)
        $('#userData\\[' + data.id + '\\]\\[phoneNumber\\]').text(data.phoneNumber)
        $('#userData\\[' + data.id + '\\]\\[email\\]').text(data.email)
        $('#userData\\[' + data.id + '\\]\\[roles\\]').text(data.roles.map(role => role.roleName));

    } else {
        let body = await response.json();
        let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
        modal.find('.modal-body').prepend(alert);
    }
    })
}

async function addNewUser() {
    $('#AddNewUserButton').click(async () => {
        let addUserForm = $('#defaultSomeForm')

        let username = addUserForm.find("#AddNewUserName").val().trim();
        let password = addUserForm.find("#AddNewUserPassword").val().trim();
        let firstName = addUserForm.find("#AddNewUserFirstName").val().trim();
        let lastName = addUserForm.find("#AddNewUserLastName").val().trim();
        let phoneNumber = addUserForm.find("#AddNewUserPhoneNumber").val().trim();
        let email = addUserForm.find("#AddNewUserEmail").val().trim();
        let rolesUser = addUserForm.find("#AddNewUserRoles").val();
        let data;
        if (rolesUser.length > 1) {
            const [firstRole, secondRole] = rolesUser;
            data = {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                roles: [
                    {
                        id: 0,
                        roleName: String(firstRole),
                        users: null
                    },
                    {
                        id: 1,
                        roleName: String(secondRole),
                        users: null
                    }
                ]
            }
        } else {
            data = {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                roles: [
                    {
                        id: 0,
                        roleName: String(rolesUser),
                        users: null
                    }
                ]
            }
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            await getTableWithUsers();

            addUserForm.find('#AddNewUserName').val('');
            addUserForm.find('#AddNewUserPassword').val('');
            addUserForm.find('#AddNewUserFirstName').val('');
            addUserForm.find('#AddNewUserLastName').val('');
            addUserForm.find('#AddNewUserPhoneNumber').val('');
            addUserForm.find('#AddNewUserEmail').val('');
            addUserForm.find('#AddNewUserRoles').val('');
            $('#table-tab').click();
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger    alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}