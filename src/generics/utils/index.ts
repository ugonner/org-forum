
   export const buildSearchObj = (searchQueryString: string): {[key: string]: string | number} => {
        const searchArr = searchQueryString.slice(1).split("&");
        const searchObj: {[key: string]: string | number} = {};
        searchArr.forEach((s) => {
            const [key, value] = s.split("=");
            searchObj[key] = value;
        })
        return searchObj;
    }