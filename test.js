

let MMM = [];
let m1 = [[1,1,1],[1,1,1]];
let m2= [[2,2,2],[2,2,2]];
MMM.push(m1);
MMM.push(m2);

let temp = MMM[0];
temp = MMM[1];
console.log(temp);



/*
//Версия с удалением
function createM1(matrix, i, j) {
    let m1 = deleteColumn(matrix, j);
    m1.splice(i, 1);
    if (i != j) {
        m1[j][i] = NaN;
    }
    return m1;
}


function createM2(matrix, a, b) {
    matrix[i][j] = NaN;
    return substractFromMatrix(m2);
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
 */


