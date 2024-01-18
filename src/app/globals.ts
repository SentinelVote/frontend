/**
 * Clear all cookies.
 * @see https://stackoverflow.com/a/33366171
 */
export function ClearCookies() {
    let cookies = document.cookie.split("; ");
    for (let c = 0; c < cookies.length; c++) {
        let d = window.location.hostname.split(".");
        while (d.length > 0) {
            const cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            let p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            }
            d.shift();
        }
    }
}

/**
 * Get a cookie by name.
 * 
 * Since `document.cookie` is not available on the server side,
 * we delay this code to run client-side in the `useEffect` hook.
 */
export function GetCookie(name: string): string | null {
    if (document === undefined) return null;
    else {
        const cookieArray = document?.cookie.split("; ");
        const cookie = cookieArray.find((row) => row.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    }
}
