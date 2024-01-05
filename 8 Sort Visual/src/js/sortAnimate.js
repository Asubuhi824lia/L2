export function selectNumb(index, timeout) {
    return () => new Promise(resolve => {
        setTimeout(()=>{
            resolve(
                document.querySelectorAll('.number')[index].classList.add('number-selected')
            )
        },timeout)
    })
}
export function selectNumbs(cur, next, timeout) {
    return () => new Promise(resolve => {
        setTimeout(()=>{
            resolve(
                document.querySelectorAll('.number')[cur].classList.add('number-selected'),
                document.querySelectorAll('.number')[next].classList.add('number-selected')
            )
        },timeout)
    })
}

export function leaveNumbs(cur, next, timeout) {
    return () => new Promise(resolve => {
        setTimeout(()=>{
            resolve(
                document.querySelectorAll('.number')[cur].classList.remove('number-selected'),
                document.querySelectorAll('.number')[next].classList.remove('number-selected')
            )
        }, timeout)
    })
}
export function leaveNumb(index, timeout) {
    return () => new Promise(resolve => {
        setTimeout(()=>{
            resolve(
                document.querySelectorAll('.number')[index].classList.remove('number-selected'),
                document.querySelectorAll('.number')[index].classList.remove('number-definable')
            )
        }, timeout)
    })
}

export function animateSwap(cur, next, timeout) {
    return () => new Promise(resolve => {
        setTimeout(()=>{
            resolve(
                document.getElementById('showArea').insertBefore(
                    document.querySelectorAll('.number')[next],
                    document.querySelectorAll('.number')[cur]
                )
            )
        },timeout)
    })
}

export function showFixedNumb(ind, timeout) {
    return () => new Promise(resolve => {
        setTimeout(()=>{
            if(ind >= 0) leaveNumbs(ind-1, ind)
            resolve(document.querySelectorAll('.number')[ind].classList.add('number-placed'))
        },timeout)
    })
}
export function showDefNumb(ind, timeout) {
    return () => new Promise(resolve => {
        setTimeout(()=>{
            if(ind >= 0) leaveNumbs(ind-1, ind)
            resolve(document.querySelectorAll('.number')[ind].classList.add('number-definable'))
        },timeout)
    })
}