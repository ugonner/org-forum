export const queryFormatter = (payload: {[key: string]: any}): string => {
    let queryString = ``;
    const objKeys = Object.keys(payload);
    objKeys.length > 0 && objKeys.forEach((key, i) => {
        const str = i === 0 ? `?${key}=${payload[key]}`: `&${key}=${payload[key]}`
        queryString += str;
    })
    return queryString;
}