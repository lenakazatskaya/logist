/*
var dMatrix = [
    ["inf1", 638893, 2695949, 1422219, 1798245],
    [637888, "inf1", 3345190, 793180, 2447486],
    [2706849, 3356737, "inf1", 4140063, 947757],
    [1422092, 794622, 4129394, "inf1", 3231690],
    [1793809, 2443697, 949435, 3227023, "inf1"]]

*/

class Point {
    constructor(i, j, bound) {
        this.i = i;
        this.j = j;
        this.bound = bound;
    }
}

var dMatrix = [
    ["inf1", 1, 2, 3, 4],
    [5, "inf1", 6, 7, 8],
    [1, 2, "inf1", 3, 4],
    [5, 6, 7, "inf1", 8],
    [2, 3, 5, 6, "inf1"]];

var origins = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров"];
var destinations = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров"];

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
function M1(matrix, a, b) {
    let m1 = removeEl(matrix, b);
    m1.splice(a, 1);
    if (a != b) {
        m1[b][a] = "inf1";
    }
    console.log(m1);
}

//Эта матрица не содержит выбранное ребро
//Мы просто закрываем путь из i в j, так как сочли его нецелессообразным
function M2(matrix, a, b) {
    matrix[i][j] = "inf1";
    return substractFromMatrix(m2);
}

function f1(matrix, a, b) {

    let m1 = removeEl(matrix, b);
    //  console.log("m1");
    //console.log(m1);
    m1.splice(a, 1);

    //! Еще раз прочитать про это
    /*if (a != b) {
        m1[b][a] = "inf1";
    }
    */


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

//!Не забыть что это должно быть рекурсивным. Или сделать итеративным?
//!Матрица все таки изменяется
function TSP(dMatrix) {

    //? пишут, что это грязная вещь( js такой js ) проверить, насколько грязная
    let tempMatrix = JSON.parse(JSON.stringify(dMatrix))
    //Редуцируем
    bound = substractFromMatrix(tempMatrix);

    // console.log(tempMatrix);

   
    while (tempMatrix.length >= 2) {

        //Выбираем ребро
        var path = getZerosCoeff(tempMatrix);
        // console.log("В начале");
        //  console.log(tempMatrix);
        // console.log(path);
        //Оцениваем что лучше
        tempMatrix = f1(tempMatrix, path[0], path[1]);
        console.log(flag);
        if (flag) {
            endPath.push(new Point(origins[path[0]], destinations[path[1]], bound));
            origins.splice(path[0], 1);
            destinations.splice(path[1], 1);
        }

    }

    console.log(tempMatrix);
    console.log(origins);
    console.log(destinations);

    console.log(endPath);
}

TSP(dMatrix);