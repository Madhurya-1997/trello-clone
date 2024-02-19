/**
 * This function will remove the element at startIndex and place it on the endIndex on the list
 * @param list 
 * @param startIndex
 * @param endIndex 
 */
export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removedItem] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removedItem);

    return result;
}