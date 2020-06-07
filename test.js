function dm() {
    return new Promise((resolve, reject) => {
        let b;
        setTimeout(() => {
            b = 3;
            resolve(b);
            console.log(b);
        }, 1000);
    });
}

function tsp(b) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            b++;
            resolve(b);
            console.log(b);
        }, 1000);
    });
}

async function end() {
}


function fn() {

    let dmpr = dm();
    dmpr.then(function (b) {
        // Функция  возвращает promise,
        // результат которого попадет в следующий then
        return tsp(b);
    })
        .then(function (b) {
            console.log(b);
        });

}

function fnn() {
    fn();
}


function testNaN(){
    let u = NaN;
    console.log(u);
    u=NaN;
}