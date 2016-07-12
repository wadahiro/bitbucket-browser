export function trimSlash(url: string) {
    const last = url.substring(url.length - 1);
    if (last === '/') {
        return url.substring(0, url.length - 1)
    }
    return url;
}

export function formatDateTime(dateMilliseconds: number) {
    return formatDate(dateMilliseconds, 'YYYY/MM/DD hh:mm:ss');
}

export function formatDate(dateMilliseconds: number, format = 'YYYY/MM/DD') {
    if (!dateMilliseconds) {
        return '';
    }
    const date = new Date(dateMilliseconds);
    return formatDateObject(date);
}

export function formatDateString(dateString: string, format = 'YYYY/MM/DD') {
    if (!dateString) {
        return '';
    }
    const date = new Date(dateString);
    return formatDateObject(date);
}

export function formatDateObject(date: Date, format = 'YYYY/MM/DD') {
    format = format.replace(/YYYY/g, date.getFullYear() + '');
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
    }
    return format;
}