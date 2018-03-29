export function kebabToCamel(str) {
    return str.replace(/(\-[A-Za-z])/g, function (m) {
        return m.toUpperCase().replace('-','')
    })
}