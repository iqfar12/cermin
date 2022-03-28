export const dateConverter = (date) => {
    const dateNow = date || new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth();
    const year = dateNow.getFullYear();
    return day + month + year
}

export const dateGenerator = () => {
    let date = new Date();
    let hours = date.getHours();
    let localDate = date.setHours(hours + 7)

    return new Date()
}