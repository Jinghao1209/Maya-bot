export default function handleError(e: any) {
    let error = new Error(e);

    console.log(`Error: ${error.message}`);
}