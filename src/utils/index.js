export const truncate = (str, length, ending) => {
    if (length == null) {
        length = 50
    }
    if (ending == null) {
        ending = '...'
    }
    if (str && str.length > length) {
        return str.substring(0, length - ending.length) + ending
    } else {
        return str
    }
}