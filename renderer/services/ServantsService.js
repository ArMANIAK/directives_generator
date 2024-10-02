import {store} from "../store/store";

export const getServants = () => store.getState().dictionaries?.servants;

export const getTitles = () => store.getState().dictionaries?.titles;

export const getDepartments = () => store.getState().dictionaries?.departments;

export const getServantById = id => getServants().find(el => el.id === id)