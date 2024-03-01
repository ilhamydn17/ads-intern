const fs = require('fs');
const path = require('path');

class AuthController {
    constructor() {
        this.controllers = {};
        this.initControllers();
    }

    initControllers() {
        const controllersPath = __dirname;
        fs.readdirSync(controllersPath).forEach((file) => {
            const controllerName = file.split('.')[0];
            if (controllerName == 'index') return;
            this.controllers[controllerName] = require(path.join(controllersPath, file));
        });
    }
}

module.exports = { AuthController: new AuthController() };