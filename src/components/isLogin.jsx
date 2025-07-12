import React from "react"
export const isLogin = () => {
    if (localStorage.getItem('user')) {
        return true
    } else {
        return false
    }
}

export const isLoginTrue = (id) => {
    if (!isLogin()) return
    if (JSON.parse(localStorage.getItem('user')).id == id) return true
    else return false
}