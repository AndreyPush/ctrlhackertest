export function debounce (callback, delay) {
    let timerId = null
    return function () {
        const context = this
        if (timerId) {
            clearTimeout(timerId)
        }
        if (context) {
            timerId = setTimeout(() => {
                callback.call(context, ...arguments)
            }, delay)
        } else timerId = setTimeout(() => { callback(...arguments) }, delay)
    }
}
