class MainController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.bindUserListChanged(this.onUserListChanged);
        this.view.bindAddUser(this.handleAddUser);

        this.onUserListChanged(this.model.users);
    }

    onUserListChanged = (users) => {
        this.view.displayUsers(users);
    }

    handleAddUser = (userName) => {
        this.model.addUser(userName);
    }
}
