export default class Logger {
    constructor() {}

    info(...message: any[]) {
        console.log("\u001B[33m[INFO]\u001B[0m", ...message);
    }

    error(...message: any[]) {
        console.log("\u001B[31m[ERROR]\u001B[0m", ...message);
    }
}
