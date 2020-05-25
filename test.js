/*
var dMatrix = [
    ["INF", 638893, 2695949, 1422219, 1798245],
    [637888, "INF", 3345190, 793180, 2447486],
    [2706849, 3356737, "INF", 4140063, 947757],
    [1422092, 794622, 4129394, "INF", 3231690],
    [1793809, 2443697, 949435, 3227023, "INF"]]

*/

class Point {
    constructor(i, j, bound) {
        this.i = i;
        this.j = j;
        this.bound = bound;
    }
}

var dMatrix = [
    ["INF", 20, 18, 12, 8],
    [5, "INF", 14, 7, 11],
    [12, 18, "INF", 6, 11],
    [11, 17, 11, "INF", 12],
    [5, 5, 5, 5, "INF"]];

var origins = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров"];
var destinations = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров"];

var bound;
var endPath = [];

//? Проверим эвристику
var allPoint = [];

/*Редукция матрицы.
Принимает на вход матрицу расстояний 
Возвращает оценку нижней границы. Нижняя граница - это стоимость, меньше которой невозможно построить данный маршрут.
Изменяет принятую матрицу так, чтобы в каждой строке и столбце был минимум один нуль.
*/
//ПРОВЕРЕНО
function matrixReduction(matrix) {
    //сумма всех вычтенных значений(констант приведения) = нижняя граница
    let lowerBound = 0;

    let minRow = [];
    let minColumn = [];

    //Размерность матрицы, отдельно чтобы не вызывать каждый раз
    let len = matrix.length;

    //Приведение строк
    for (let i = 0; i < len; i++) {
        let min = Number.MAX_VALUE;

        //Находим минимальный элемент в строке
        for (let elem of matrix[i]) {
            if (min > elem) {
                min = elem;
            }
        }

        //Добавляем его к нижней границе
        lowerBound += min;

        //Отнимаем константу приведения от каждого значения строки
        //Матрица изменяется в этом месте
        for (let j = 0; j < len; j++) {
            matrix[i][j] -= min;
        }
    }

    //Приведение столбцов
    for (let j = 0; j < len; j++) {
        let min = Number.MAX_VALUE

        for (let i = 0; i < len; i++) {
            if (min > matrix[i][j]) {
                min = matrix[i][j];
            }
        }

        lowerBound += min;

        for (let i = 0; i < len; i++) {
            matrix[i][j] -= min;
        }
    }

    return lowerBound;
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
        m1[b][a] = "INF";
    }
    console.log(m1);
}

//Эта матрица не содержит выбранное ребро
//Мы просто закрываем путь из i в j, так как сочли его нецелессообразным
function M2(matrix, a, b) {
    matrix[i][j] = "INF";
    return substractFromMatrix(m2);
}

function f1(matrix, a, b) {

    let m1 = removeEl(matrix, b);
    //  console.log("m1");
    //console.log(m1);
    m1.splice(a, 1);

    //! Еще раз прочитать про это
    /*if (a != b) {
        m1[b][a] = "INF";
    }
    */


    //  console.log(m1);

    let m2 = JSON.parse(JSON.stringify(matrix));
    m2[a][b] = "INF";

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


//Функция, превращающая список ребер в список точек по порядку
//ПРОВЕРЕНО
function edgesToAddress(list) {
    let result = [];
    result.push(list[0].i, list[0].j);
    for (let i = 1; i < list.length; i++) {
        let temp = result[result.length - 1];
        for (let j = 0; j < list.length; j++) {
            if (temp === list[j].i) {
                result.push(list[j].j);
                j = list.length;
            }
        }
    }
    return result;
}

var flag;

//!Не забыть что это должно быть рекурсивным. Или сделать итеративным?
//!Матрица все таки изменяется
function TSP(dMatrix) {

    console.log(matrixReduction(dMatrix));
    console.log(dMatrix);


    
    /*

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
 */

}

TSP(dMatrix);