export const setItemInLocalStorage  = (key,value) => localStorage.setItem(key , JSON.stringify(value))

export const getItemInLocalStorage = (key)=> JSON.parse(localStorage.getItem(key))


// export const setToken = (key, value) => localStorage.setItem(key, value) // No JSON.stringify
// export const getToken = (key) => localStorage.getItem(key) // No JSON.parse