import { logger } from "../Constant";

export default function handleError(e: any) {
    let error = new Error(e);

    logger.error(`Error: ${error.message}`);
}
