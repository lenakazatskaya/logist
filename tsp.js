
//СТРУКТУРЫ
class Verge {
    constructor(i, j, weigth, rate) {
        this.i = i;
        this.j = j;
        this.weigth = weigth;
        this.rate = rate;
    }
}

class Node {
    constructor(arrayVerge, loverBound) {
        this.arrayVerge = JSON.parse(JSON.stringify(arrayVerge));
        this.loverBound = loverBound;
        this.visited = false;
    }
}

//Костыль при невозможности добавить несколько конструкторов
function createChildNode(parentNode, verge, rate) {
    let node = new Node(parentNode.arrayVerge, parentNode.loverBound + rate);
    if (verge != "INF") {
        node.arrayVerge.push(verge);
    }
    return node;

}


//ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ

//Массив, хранящий все созданные узлы
arrayNode = [];

//Массив, хранящий все матрицы по тем же индексам, что и узлы
arrayMatrix = [];

//Указатель на массивы узлов/матриц
marker = 1;

//ТЕСТОВЫЕ ДАННЫЕ
//Для сохранения первоначальных значений
let distance_matrix = [
    [NaN, 20, 18, 12, 8],
    [5, NaN, 14, 7, 11],
    [12, 18, NaN, 6, 11],
    [11, 17, 11, NaN, 12],
    [5, 5, 5, 5, NaN]];

let dMatrix = [
    [NaN, 20, 18, 12, 8],
    [5, NaN, 14, 7, 11],
    [12, 18, NaN, 6, 11],
    [11, 17, 11, NaN, 12],
    [5, 5, 5, 5, NaN]];

var origins = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров"];
var destinations = ["Омск", "Новосибирск", "Москва", "Красноярск", "Киров"];

/*Редукция матрицы.
Принимает на вход матрицу расстояний 
Возвращает оценку нижней границы. Нижняя граница - это стоимость, меньше которой невозможно построить данный маршрут.
Изменяет принятую матрицу так, чтобы в каждой строке и столбце был минимум один нуль.
Флаг значит, изменять матрицу или нет
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
        if (min != Number.MAX_VALUE) {
            lowerBound += min;
        }

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

        if (min != Number.MAX_VALUE) {
            lowerBound += min;
        }

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
Получим ребро с максимальным штрафом
Возвращает само ребро
*/

//ПРОВЕРЕНО
function getBestVerge(matrix) {

    let bestVerge = new Verge(NaN, NaN, NaN, Number.MIN_VALUE);

    for (let i = 0; i < matrix.length; i++) {

        for (let j = 0; j < matrix.length; j++) {
            if (matrix[i][j] == 0) {
                let rate = getRateVerge(matrix, i, j);
                if (rate > bestVerge.rate) {
                    bestVerge = new Verge(i, j, distance_matrix[i][j], rate);
                }
            }
        }
    }
    return bestVerge;
}


/*M1 равна M с удаленными строкой i и столбцом j. Эта матрица содержит выбранное ребро
Если i!-j, удаляем в измененной матрице ребро j,i чтобы избежать создания
нескольких независимых циклов
Возвращает новую матрицу
M2 матрица не содержит выбранное ребро
Мы просто закрываем путь из i в j, так как сочли его нецелессообразным
*/
//ПРОВЕРЕНО
//Возвращает копию измененной матрицы
//? Подумать о целесообразности добавить сюда же редукцию
function matrixСhange(flag, i, j, matr) {
    let matrix = copyMatrix(matr);
    if (flag) {
        for (let a = 0; a < matrix.length; a++) {
            matrix[i][a] = NaN;
            matrix[a][j] = NaN;
        }
        if (i != j) {
            matrix[j][i] = NaN;
        }
    } else {
        matrix[i][j] = NaN;
    }
    return matrix;
}


//!Переписать менее дендрофекальным способом
function copyMatrix(matrix) {

    let newMatrix = JSON.parse(JSON.stringify(matrix));

    for (let i = 0; i < newMatrix.length; i++) {
        for (let j = 0; j < newMatrix.length; j++) {

            if (newMatrix[i][j] === null) {
                newMatrix[i][j] = NaN;

            }
        }
    }
    return newMatrix;
}

/*
function isEnd(matrix) {
  
   for (let i = 0; i < matrix.length; i++) {
       for (let j = 0; j < matrix.length; j++) {
//Че то условие не работает
           if (matrix[i][j] != undefined) {
               console.log(matrix[i][j]);
               return false;
           }
       }
   }
   return true;
}*/

function isEnd(node) {
    if (node.loverBound == getLengthRoute(node)) {
        return true;
    }
    return false;

}

function getLengthRoute(node) {
    let lengthRoute = 0;

    for (let i = 0; i < node.arrayVerge.length; i++) {
        lengthRoute += distance_matrix[node.arrayVerge[i].i][node.arrayVerge[i].j];
    }
    return lengthRoute;
}

//Может переписать тупо на поиск индекса указателю
function getBestNode() {
    let bestLoverBound = Number.MAX_VALUE;
    let bestNode;
    for (let i = 0; i < arrayNode.length; i++) {
        if (bestLoverBound > arrayNode[i].loverBound && arrayNode[i].visited == false) {
            bestNode = arrayNode[i];
            bestLoverBound = arrayNode[i].loverBound;
            marker = i;
        }
    }
    bestNode.visited = true;
    return bestNode;
}


function TSP(dMatrix) {


    let currentNode = new Node([], matrixReduction(dMatrix));
    let currentMatrix = dMatrix;
    currentNode.visited = true;

    arrayNode.push(currentNode);
    arrayMatrix.push(copyMatrix(currentMatrix));

    //А тут надо как раз цикл запускать
    while (true) {

        if (currentNode.arrayVerge.length == dMatrix.length - 2) {
            console.log(currentNode);
            console.log(currentMatrix);
            break;
        }

        let verge = getBestVerge(currentMatrix);

        let m2 = matrixСhange(false, verge.i, verge.j, currentMatrix);
        rightRate = matrixReduction(m2);

        arrayMatrix.push(copyMatrix(m2));
        arrayNode.push(createChildNode(currentNode, 'INF', rightRate));

        let m1 = matrixСhange(true, verge.i, verge.j, currentMatrix);
        leftRate = matrixReduction(m1);

        arrayMatrix.push(copyMatrix(m1));
        arrayNode.push(createChildNode(currentNode, verge, leftRate));
        currentNode = getBestNode();
        currentMatrix = arrayMatrix[marker];
    }

    for (let i = 0; i < currentMatrix.length; i++) {
        for (let j = 0; j < currentMatrix.length; j++) {
            if (!Number.isNaN(currentMatrix[i][j])) {
                verge = new Verge(i, j);
                currentNode = createChildNode(currentNode, verge);
                currentMatrix = matrixСhange(true, i, j, currentMatrix);
            }
        }
    }
    return vergesToAddress(currentNode.arrayVerge);
}



console.log(TSP(dMatrix));

