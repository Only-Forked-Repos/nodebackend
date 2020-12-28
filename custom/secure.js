export function numPad(number, length){
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;
}

export const checkDataIsValid = (data) => {
    if(data !== null && data !== undefined && data !== ''){
        return true;
    }
    return false;
}

export const perPageDisplay = 10;