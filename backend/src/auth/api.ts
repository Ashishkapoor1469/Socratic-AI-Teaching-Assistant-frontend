export const authApi = {
            message: "server is up and running",
            status: 200,
            name: "Socratic-AI-Teaching-Assistant-Bakcend",
            developers: {
                frontend: "ashish kapoor",
                baceknd: "sujan thapa"
            },

            endpoints: {
                auth: {
                    register: "https://closefistedly-ditriglyphic-tameika.ngrok-free.dev/api/auth/register",
                    registerParams: {
                        name: "string",
                        username: "string",
                        email: "string",
                        password: "string"
                    },
                    login: "https://closefistedly-ditriglyphic-tameika.ngrok-free.dev/api/auth/login",
                    loginParam: {
                        email: "string",
                        password: "string"
                    }
                }
            }
        }

