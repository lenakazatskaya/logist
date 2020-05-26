//СТРУКТУРЫ
class Verge {
    //?Добавить ли вес ребра?
    constructor(i, j, rate) {
        this.i = i;
        this.j = j;
       // this.weigth = weigth;
        this.rate = rate;

    }
}

class Node {
    constructor(arrayVerge, loverBound) {
        this.arrayVerge = JSON.parse(JSON.stringify(arrayVerge));
        this.loverBound = loverBound;
    }
    constructor(parentNode, verge) {
        //? Может оставить просто ссылкой?
        this.arrayVerge = JSON.parse(JSON.stringify(parentNode.arrayVerge));
        this.arrayVerge.push(verge);
        this.loverBound = parentNode.loverBound + verge.rate;
    }

}
//ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ

//Массив, хранящий все созданные узлы
arrayNode = [];

//Массив, хранящий все матрицы по тем же индексам, что и узлы
arrayMatrix = [];

//ТЕСТОВЫЕ ДАННЫЕ
var dMatrix = [
    ["INF", 20, 18, 12, 8],
    [5, "INF", 14, 7, 11],
    [12, 18, "INF", 6, 11],
    [11, 17, 11, "INF", 12],
    [5, 5, 5, 5, "INF"]];

var origins = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров"];
var destinations = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров"];

/*Редукция матрицы.
Принимает на вход матрицу расстояний 
Возвращает оценку нижней границы. Нижняя граница - это стоимость, меньше которой невозможно построить данный маршрут.
Изменяет принятую матрицу так, чтобы в каждой строке и столбце был минимум один нуль.
*/
//ПРОВЕРЕНО
function matrixReduction(matrix) {
    //сумма всех вычтенных значений(констант приведения) = нижняя граница
    let lowerBound = 0;

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

//Функция, превращающая список ребер в упорядоченный список точек
//ПРОВЕРЕНО
function vergesToAddress(list) {
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

/*Расчет коэффициента для выбранного ребра
Принимает матрицу расстояний и координаты ребра
Возвращает штраф за неиспользование ребра
*/
//ПРОВЕРЕНО
function getRateVerge(matrix, i, j) {
    let rowMinValue = Number.MAX_VALUE;
    let colMinValue = Number.MAX_VALUE;
    for (let k = 0; k < matrix.length; k++) {
        if (rowMinValue > matrix[i][k] && k != j) {
            rowMinValue = matrix[i][k];
        }
        if (colMinValue > matrix[k][j] && k != i) {
            colMinValue = matrix[k][j];
        }
    }
    return rowMinValue + colMinValue;
}

/* Получает редуцированную матрицу
Ищет все нулевые элементы и оценивает их.
Получим ребро с максимальным штрафом*/
//ПРОВЕРЕНО
function getBestVerge(matrix) {

    let bestVerge = new Verge('INF', 'INF', 'INF', Number.MIN_VALUE);

    for (let i = 0; i < matrix.length; i++) {

        for (let j = 0; j < matrix.length; j++) {
            if (matrix[i][j] == 0) {
                let rate = getRateVerge(matrix, i, j);
                if (rate > bestVerge.rate) {
                    bestVerge = new Verge(i, j, matrix[i][j], rate);
                }
            }
        }
    }
    return bestVerge;
}

//Функция удаляет выбранный столбец
//ПРОВЕРЕНО
//!Разобраться как это работает и сделать такое же для строк 
//!Нужно ли возвращать копию?
function deleteColumn(matrix, index) {
    return matrix.map(function (arr) {
        return arr.filter(function (el, idx) { return idx !== index });
    });
};

/*M1 равна M с удаленными строкой i и столбцом j. Эта матрица содержит выбранное ребро
Если i!-j, удаляем в измененной матрице ребро j,i чтобы избежать создания
нескольких независимых циклов
Возвращает новую матрицу
*/
//ПРОВЕРЕНО
//! ПРОВЕРИТЬ ТЕОРИЮ

function createM1(matrix, i, j) {
    let m1 = deleteColumn(matrix, j);
    m1.splice(i, 1);
    if (i != j) {
        m1[j][i] = "INF";
    }
    return m1;
}

/*Версия с удалением 
function createM1(matrix, i, j) {
    let m1 = deleteColumn(matrix, j);
    m1.splice(i, 1);
    if (i != j) {
        m1[j][i] = "INF";
    }
    return m1;
}
*/
/*Эта матрица не содержит выбранное ребро
Мы просто закрываем путь из i в j, так как сочли его нецелессообразным
*/
function createM2(matrix, a, b) {
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



//!Не забыть что это должно быть рекурсивным. Или сделать итеративным?
//!Матрица все таки изменяется
function TSP(dMatrix) {

    console.log(dMatrix);

    let arrayVerge = [];
    arrayVerge.push(new Verge('A', 'S', 4))



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