import { store } from "../store";

export const getServants = () => store.getState().dictionaries?.servants;

export const getActiveServants = () => getServants().filter(el => el.retired !== "так");

export const getServantById = id => getServants().find(el => "" + el.id === "" + id)

export const getRoles = () => store.getState().dictionaries?.roles;

export const getTitles = () => store.getState().dictionaries?.titles;

export const getDepartments = () => store.getState().dictionaries?.departments;

export const isEmployee = id => {
    let servant = getServantById(id)
    return servant?.rank === 0;
}

export const isFemale = id => {
    let servant = getServantById(id)
    return servant?.gender.toLocaleLowerCase() === "ж";
}

export const hasSubstitutionRole = id => {
    let servant = getServantById(id)
    return servant && servant.subst_title_index !== "";
}

export const convertAmountIntoWords = amount => {
    let num = parseInt(amount)
    if (num === 0) return "нуль гривень";

    const ones = ["", "один", "два", "три", "чотири", "п'ять", "шість", "сім", "вісім", "дев'ять", "десять", "одинадцять", "дванадцять", "тринадцять", "чотирнадцять", "п'ятнадцять", "шістнадцять", "сімнадцять", "вісімнадцять", "дев'ятнадцять"];
    const onesFeminine = ["", "одна", "дві", "три", "чотири", "п'ять", "шість", "сім", "вісім", "дев'ять", "десять", "одинадцять", "дванадцять", "тринадцять", "чотирнадцять", "п'ятнадцять", "шістнадцять", "сімнадцять", "вісімнадцять", "дев'ятнадцять"];
    const tens = ["", "", "двадцять", "тридцять", "сорок", "п'ятдесят", "шістдесят", "сімдесят", "вісімдесят", "дев'яносто"];
    const hundreds = ["", "сто", "двісті", "триста", "чотириста", "п'ятсот", "шістсот", "сімсот", "вісімсот", "дев'ятсот"];
    const thousands = ["тисяча", "тисячі", "тисяч"];
    const millions = ["мільйон", "мільйони", "мільйонів"];
    const billions = ["мільярд", "мільярди", "мільярдів"];
    const hryvnias = ["гривня", "гривні", "гривень"];

    function getForm(num, forms) {
        if (num % 10 === 1 && num % 100 !== 11) return forms[0];
        if (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)) return forms[1];
        return forms[2];
    }

    function convertLessThanThousand(n, feminine = false) {
        let words = "";
        if (n >= 100) {
            words += hundreds[Math.floor(n / 100)] + " ";
            n %= 100;
        }
        if (n >= 20) {
            words += tens[Math.floor(n / 10)] + " ";
            n %= 10;
        }
        if (n > 0) {
            words += (feminine ? onesFeminine[n] : ones[n]) + " ";
        }
        return words.trim();
    }

    let words = "";

    if (num >= 1_000_000_000) {
        let billionsPart = Math.floor(num / 1_000_000_000);
        words += convertLessThanThousand(billionsPart) + " " + getForm(billionsPart, billions) + " ";
        num %= 1_000_000_000;
    }

    if (num >= 1_000_000) {
        let millionsPart = Math.floor(num / 1_000_000);
        words += convertLessThanThousand(millionsPart) + " " + getForm(millionsPart, millions) + " ";
        num %= 1_000_000;
    }

    if (num >= 1000) {
        let thousandsPart = Math.floor(num / 1000);
        words += convertLessThanThousand(thousandsPart, true) + " " + getForm(thousandsPart, thousands) + " ";
        num %= 1000;
    }

    if (num > 0) {
        words += convertLessThanThousand(num, true) + " ";
    }

    words = words.trim() + ") " + getForm(num, hryvnias);

    return words.trim();
}