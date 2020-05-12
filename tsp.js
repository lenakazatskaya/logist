class Point {
    constructor(i, j, bound, path) {
        this.i = i;
        this.j = j;
        this.bound = bound;
    }
}
/*
var dMatrix = [
    ["inf1", 1, 2, 3, 4],
    [5, "inf1", 6, 7, 8],
    [1, 2, "inf1", 3, 4],
    [5, 6, 7, "inf1", 8],
    [2, 3, 5, 6, "inf1"]];
*/

var dMatrix = [["inf1", 638893, 2695995, 1422201, 1798245, 2403512, 3001483, 943534, 1791137, 2225536],
[637888, "inf1", 3345236, 793162, 2447486, 3052753, 3650724, 1592775, 2440378, 2874777],
[2706897, 3356785, "inf1", 4140092, 947757, 335173, 1392625, 1728983, 1065844, 849763],
[1422092, 794622, 4129440, "inf1", 3231690, 3836957, 4434928, 2376979, 3224582, 3658981],
[1793809, 2443697, 949435, 3227005, "inf1", 615843, 1848413, 848592, 741232, 1074142],
[2398388, 3048276, 336408, 3831584, 614142, "inf1", 1730233, 1453170, 1033744, 952782],
[3025900, 3675788, 1396673, 4459096, 1849415, 1728523, "inf1", 2195328, 1185746, 800131],
[942876, 1592764, 1730489, 2376072, 851691, 1456958, 2169359, "inf1", 959013, 1393412],
[1789768, 2439655, 1063146, 3222963, 742819, 1014700, 1186450, 959195, "inf1", 425251],
[2228814, 2878702, 847864, 3662010, 1074076, 955132, 786495, 1398242, 424750, "inf1"],
];

var stateOrigins = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров",
    "Кострома", "Астрахань", "Екатеринбург", "Самара", "Саратов"];
var stateDestinations = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров",
    "Кострома", "Астрахань", "Екатеринбург", "Самара", "Саратов"];
var origins = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров",
    "Кострома", "Астрахань", "Екатеринбург", "Самара", "Саратов"];
var destinations = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров",
    "Кострома", "Астрахань", "Екатеринбург", "Самара", "Саратов"];

var bound;
var endPath = [];

//? Проверим эвристику
var allPoint = [];

//Редукция матрицы
function substractFromMatrix(dMatrix) {
    //сумма всех вычтенных значений
    var subtractSum = 0;

    var minRow = [];
    var minColumn = [];

    var len = dMatrix.length;

    //? Можно убрать пару условий, если заранее заполнить массивы. Стоит ли?
    //Поиск минимального элемента в каждой строке
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (minRow[i] == undefined && dMatrix[i][j] != "inf1") {
                minRow[i] = dMatrix[i][j];
            } else {
                if (dMatrix[i][j] < minRow[i]) {
                    minRow[i] = dMatrix[i][j];
                }
            }
        }
        //Вычитание минимальных элементов из всех
        //элементов строки, кроме бесконечностей

        for (let j = 0; j < len; j++) {
            if (dMatrix[i][j] != "inf1") {
                dMatrix[i][j] -= minRow[i];
            }

            //Поиск минимального элемента в столбце,
            //после вычитания строк
            if (minColumn[i] == undefined && dMatrix[i][j] != "inf1") {
                minColumn[i] = dMatrix[i][j];
            } else {
                if (dMatrix[i][j] < minColumn[i]) {
                    minColumn[i] = dMatrix[i][j];
                }
            }
        }
    }

    //Вычитание минимальных элементов
    //из всех элементов столбца

    for (let j = 0; j < len; j++) {
        for (let i = 0; i < len; i++) {
            if (dMatrix[i][j] != "inf1") {
                dMatrix[i][j] -= minColumn[j];
            }
        }
    }

    //просуммируем что получилось
    for (let i = 0; i < len; i++) {
        subtractSum += minRow[i];
        subtractSum += minColumn[i];
    }
    return subtractSum;
}
//Расчет коэффициента для выбранного нулевого элемента
function getCoefficient(dMatrix, i, j) {
    let rMin = Number.MAX_VALUE;
    let cMin = Number.MAX_VALUE;
    for (let k = 0; k < dMatrix.length; k++) {

        if (rMin > dMatrix[i][k] && k != j) {
            rMin = dMatrix[i][k];
        }
        if (cMin > dMatrix[k][j] && k != i) {
            cMin = dMatrix[k][j];
        }
    }
    return rMin + cMin;
}
//Поиск всех нулевых элементов и расчет их коэффициентов
//Получим индекс нулевого элемента с максимальным коэффициентом
function getZerosCoeff(dMatrix) {
    var maxZero = [];
    var maxZerosValue = Number.MIN_VALUE;

    for (let i = 0; i < dMatrix.length; i++) {

        for (let j = 0; j < dMatrix.length; j++) {
            if (dMatrix[i][j] == 0) {
                let temp = getCoefficient(dMatrix, i, j);
                if (temp > maxZerosValue) {
                    maxZerosValue = temp;
                    maxZero[0] = i;
                    maxZero[1] = j;
                }
            }
        }
    }
    return maxZero;
}

function getCost(path) {
    let cost = 0;
    for (let i = 0; i < path.length; i++) {
        let a = stateOrigins.indexOf(path[i].i);
        let b = stateDestinations.indexOf(path[i].j);
        cost += dMatrix[a][b];
    }
    return cost;
}


//Функция удаляет выбранный столбец
//!Разобраться как это работает и сделать такое же для строк
function removeEl(array, remIdx) {
    return array.map(function (arr) {
        return arr.filter(function (el, idx) { return idx !== remIdx });
    });
};

//M1 равна M с удаленными строкой i и столбцом j. Эта матрица содержит выбранное ребро
//Если i!-j, удаляем в измененной матрице ребро j,i чтобы избежать создания
//нескольких независимых циклов
//M2 не содержит выбранное ребро
//Мы просто закрываем путь из i в j, так как сочли его нецелессообразным

function f1(matrix, a, b) {

    let m1 = JSON.parse(JSON.stringify(matrix));
    if (a != b) {
        m1[b][a] = "inf1";
    }

    m1 = removeEl(m1, b);
    //  console.log("m1");
    //console.log(m1);
    m1.splice(a, 1);


    //  console.log(m1);

    let m2 = JSON.parse(JSON.stringify(matrix));
    m2[a][b] = "inf1";

    let temp1 = substractFromMatrix(m1);
    let temp2 = substractFromMatrix(m2);
    if (temp1 > temp2) {
        bound += temp2;
        // console.log("Без ребра");
        flag = false;
        return m2;
    } else {
        bound += temp1;
        //  console.log("C ребром");
        flag = true;
        return m1;
    }
}

var flag;
function TSP(dMatrix) {

    //? пишут, что это грязная вещь( js такой js ) проверить, насколько грязная
    let tempMatrix = JSON.parse(JSON.stringify(dMatrix))
    //Редуцируем
    bound = substractFromMatrix(tempMatrix);

    // console.log(tempMatrix);


    while (tempMatrix.length > 2) {

        //Выбираем ребро
        var path = getZerosCoeff(tempMatrix);
        // console.log("В начале");
        //  console.log(tempMatrix);
        // console.log(path);
        //Оцениваем что лучше

        tempMatrix = f1(tempMatrix, path[0], path[1]);

        if (flag) {
            endPath.push(new Point(origins[path[0]], destinations[path[1]], bound));
            origins.splice(path[0], 1);
            destinations.splice(path[1], 1);
        }

    }

    path = getZerosCoeff(tempMatrix);
    endPath.push(new Point(origins[path[0]], destinations[path[1]]));

    origins.splice(path[0], 1);
    destinations.splice(path[1], 1);


    endPath.push(new Point(origins[0], destinations[0]));
    console.log(endPath);

    console.log(getCost(endPath));
}

var time = performance.now();

console.log(stateOrigins);
TSP(dMatrix);


