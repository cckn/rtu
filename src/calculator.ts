export class Calculator {
    public value: number;

    constructor() {
        this.value = 0;
    }

    public add(n: number): number {
        this.value += n;
        return this.value;
    }
}
