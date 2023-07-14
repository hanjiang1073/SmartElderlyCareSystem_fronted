// store.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        username: '',
        email: '',
        role: [],
        jwt: '',
        userId: ''
    }),
    actions: {
        setUser(user) {
            this.username = user.username
            this.email = user.email
            this.role = user.role
            this.jwt = user.jwt
            this.userId = user.userId
        }
    },
    getters: {
        getUser() {
            return {
                username: this.username,
                email: this.email,
                role: this.role,
                jwt: this.jwt,
                userId: this.userId
            }
        }
    }
})