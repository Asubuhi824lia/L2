export function selectNumbs(cur, next, timeout) {
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve(
                document.querySelectorAll('.number')[cur].classList.add('number-selected'),
                document.querySelectorAll('.number')[next].classList.add('number-selected')
            )
        },timeout)
    })
}

export function animateExchange(cur, next, timeout) {
    return new Promise(resolve => {
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

export function leaveNumbs(cur, next, timeout) {
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve(document.querySelectorAll('.number')[cur].classList.remove('number-selected'))
            resolve(document.querySelectorAll('.number')[next].classList.remove('number-selected'))
        },timeout)
    })
}

export function showFixedNumb(ind, timeout) {
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve(document.querySelectorAll('.number')[ind].classList.add('number-placed'))
        },timeout)
    })
}