class Matrix {
    constructor(array) {
        if (!(array[0] instanceof Array)) {
            for (let i = 0; i < array.length; i++) {
                array[i] = [array[i]];
            }
        }
        return array;
    }

    static add(a, b) {
        let add = [];
        for (let i = 0; i < a.length; i++) {
            add[i] = [];
            for (let j = 0; j < a[0].length; j++) {
                add[i][j] = a[i][j] + b[i][j];
            }
        }
        return add;
    }

    static subtract(a, b) {
        let subtract = [];
        for (let i = 0; i < a.length; i++) {
            subtract[i] = [];
            for (let j = 0; j < a[0].length; j++) {
                subtract[i][j] = a[i][j] - b[i][j];
            }
        }
        return subtract;
    }

    static multiply(a, b) {
        let product = [];
        if(!(a instanceof Array)){
            for (let i = 0; i < b.length; i++) {
                product[i] = [];
                for (let j = 0; j < b[0].length; j++) {
                    product[i][j] = a * b[i][j];
                }
            } 
        } else if(!(b instanceof Array)){
            for (let i = 0; i < a.length; i++) {
                product[i] = [];
                for (let j = 0; j < a[0].length; j++) {
                    product[i][j] = a[i][j] * b;
                }
            }
        } else {
            for (let i = 0; i < a.length; i++) {
                product[i] = [];
                for (let j = 0; j < a[0].length; j++) {
                    product[i][j] = a[i][j] * b[i][j];
                }
            }
        }
        
        return product;

    }

    static dot(a, b) {
        let dot = [];
        for (let i = 0; i < a.length; i++) {
            dot[i] = [];
            for (let j = 0; j < b[0].length; j++) {
                dot[i][j] = 0;
                for (let k = 0; k < b.length; k++) {
                    dot[i][j] += a[i][k] * b[k][j]
                }
            }
        }
        return dot;
    }

    static map(array, func) {
        let result = [];
        for (let i = 0; i < array.length; i++) {
            result[i] = [];
            for (let j = 0; j < array[0].length; j++) {
                result[i][j] = func(array[i][j]);
            }
        }
        return result;
    }

    static transpose(array){
        let result = [];
        for (let i = 0; i < array[0].length; i++) {
            result[i] = [];
            for (let j = 0; j < array.length; j++) {
                result[i][j] = array[j][i];
            }
        }
        return result;
    }

}