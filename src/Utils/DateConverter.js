export const dateConverter = (date) => {
    const dateNow = date || new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth();
    const year = dateNow.getFullYear();
    return day + month + year
}