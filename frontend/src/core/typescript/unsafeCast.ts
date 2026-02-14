/**
 * Note: Is unsafe because this ignores the type
 * of the value to be casted and casts it into
 * the desired type immediately, this function exists
 * only for typescript, and only typescript, this
 * function adds little to no overhead.
 * @param value The value to be casted.
 * @returns 
 */
function unsafeCast<T>(value: unknown): T {
    return value as T;
}

export default unsafeCast;