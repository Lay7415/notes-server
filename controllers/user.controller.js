class UserController {
    async registration(req, res, next) {
        try {

        } catch (error) {
            console.error(error)
        }
    }

    async login(req, res, next) {
        try {
            
        } catch (error) {
            console.error(error)
        }
    }

    async refresh(req, res, next) {
        try {
            return res.json('hello')
        } catch (error) {
            console.error(error)
        }
    }

    async logout(req, res, next) {
        try {
            
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = new UserController()