export const formatTimestamp = timestamp => {
    const date = new Date(timestamp * 1000);
    const hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
    const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

    const month = (date.getMonth() < 10 ? "0" : "") + date.getMonth();
    const day = (date.getDate() < 10 ? "0" : "") + date.getDate();

    return `${hours}:${minutes} ${day}.${month}.${date.getFullYear()}`
}