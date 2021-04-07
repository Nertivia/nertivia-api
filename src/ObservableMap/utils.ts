const arrayConstructor = [].constructor;
const objectConstructor = ({}).constructor;

export function isObjectOrArray(object: object) {
    if (object?.constructor === arrayConstructor) {
        return true;
    }
    if (object?.constructor === objectConstructor) {
        return true;
    }
    return false
}