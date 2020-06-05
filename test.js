
let a;


function fn() {

    let promise1 = new Promise((resolve, reject) => {
        function dm() {
            setTimeout(() => {
                a = 3;
                resolve('result');
            }, 1000);
        }
        dm();
    });

    // promise.then навешивает обработчики на успешный результат или ошибку
    promise1
        .then(
            result => {
                let promise2 = new Promise((resolve, reject) => {

                    function tsp() {
                        setTimeout(() => {
                            a = 4;
                            resolve('result');
                        }, 1000);
                    }
                    tsp();
                });

                promise2
                    .then(
                        result => {

                            function end() {
                            }

                            end();
                        },
                        error => {
                            // вторая функция - запустится при вызове reject
                            alert("Rejected: " + error); // error - аргумент reject
                        }
                    );
            },
            error => {
                // вторая функция - запустится при вызове reject
                alert("Rejected: " + error); // error - аргумент reject
            }
        );

}

avait function tf()