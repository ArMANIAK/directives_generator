import { store } from "../store";

export const getServants = () => store.getState().dictionaries?.servants;

export const getRoles = () => store.getState().dictionaries?.roles;

export const getTitles = () => store.getState().dictionaries?.titles;

export const getDepartments = () => store.getState().dictionaries?.departments;

export const getServantById = id => getServants().find(el => el.id === id)

export const isEmployee = id => {
    let servant = getServantById(id)
    return servant?.rank === 0;
}