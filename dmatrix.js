//На вход список адресов

var address = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров",
    "Кострома", "Астрахань", "Екатеринбург", "Самара", "Саратов"];
//На выход таблица расстояний
function initMap(params) {
    //Инициализируем сервис
    const service = new google.maps.DistanceMatrixService();

    //Устанавливаем настройки
    const matrixOptions = {
        origins: address, // откуда
        destinations: address, // куда
        //TO DO доступны различные варианты, можно настроить кастомизацию
        travelMode: 'DRIVING', //каким образом
    };
    // Отправляем запрос
    service.getDistanceMatrix(matrixOptions, callback);

    // Callback нужен, поскольку запрос асинхронный
    function callback(response, status) {
        if (status !== "OK") {
            alert("Error with distance matrix");
            return;
        }
        console.log("dmatrix response");
        console.log(response);

        //А теперь парсим
        var len = address.length;
        //Матрицы расстояний и времени
        var distmatrix = [len];
        var tmatrix = [len];

        for (var i = 0; i < len; i++) {
            var results = response.rows[i].elements
            distmatrix[i] = [len];
            tmatrix[i] = [len];
            for (var j = 0; j < len; j++) {
                if (results[j].distance.value != 0) {
                    distmatrix[i][j] = results[j].distance.value;
                    tmatrix[i][j] = results[j].duration.value;
                } else {
                    distmatrix[i][j] = "inf1";
                    tmatrix[i][j] = results[j].duration.value;
                }
            }
        }
        console.log(distmatrix);
        console.log(tmatrix);


    }
}

