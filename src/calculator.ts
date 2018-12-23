export class Calculator {
    value: number

    constructor() {
        this.value = 0
    }

    add(n: number): number {
        this.value += n
        console.log('dd')
        return this.value
    }
}
