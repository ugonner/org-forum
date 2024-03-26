export const camelCaseNameFormatter = (camelCasedString: string): string => {
    let formattedName = "";
    for(let i = 0; i < camelCasedString.length; i++){
        (/[a-z]/.test(camelCasedString[i])) ? formattedName += camelCasedString[i] : formattedName += ` ${camelCasedString[i]}`
    }
    return formattedName.toLowerCase();
}