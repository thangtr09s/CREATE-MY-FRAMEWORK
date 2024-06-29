class UserView {
    constructor() {
        this.app = document.getElementById('app');

        this.form = this.createElement('form');
        this.input = this.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Enter name';

        this.submitButton = this.createElement('button');
        this.submitButton.textContent = 'Add User';

        this.form.append(this.input, this.submitButton);
        this.app.append(this.form);

        this.userList = this.createElement('ul');
        this.app.append(this.userList);

        this._temporaryUserName = '';
        this._initLocalListeners();
    }

    createElement(tag, className) {
        const element = document.createElement(tag);
        if (className) element.classList.add(className);
        return element;
    }

    _initLocalListeners() {
        this.input.addEventListener('input', event => {
            this._temporaryUserName = event.target.value;
        });

        this.form.addEventListener('submit', event => {
            event.preventDefault();
            if (this._temporaryUserName) {
                this.onAddUser(this._temporaryUserName);
                this._resetInput();
            }
        });
    }

    _resetInput() {
        this._temporaryUserName = '';
        this.input.value = '';
    }

    displayUsers(users) {
        while (this.userList.firstChild) {
            this.userList.removeChild(this.userList.firstChild);
        }

        users.forEach(user => {
            const li = this.createElement('li');
            li.textContent = user;
            this.userList.append(li);
        });
    }

    bindAddUser(handler) {
        this.onAddUser = handler;
    }
}
