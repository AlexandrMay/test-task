class Configuration {
    #adminUIUrl = 'https://admin.staging.exberry-uat.io/';
    #adminAPIUrl = 'https://admin-api-shared.staging.exberry-uat.io/api';
    #sandboxUrl = 'https://sandbox.exberry.io/';

    get configUrls() {
        return {
            adminAPIUrl: this.#adminAPIUrl,
            adminUIUrl: this.#adminUIUrl,
            sandboxUrl: this.#sandboxUrl
        }
    }
} module.exports = new Configuration();