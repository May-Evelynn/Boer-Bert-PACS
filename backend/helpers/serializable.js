function toSerializable(value) {
    if (value === null || value === undefined) return value;
    if (typeof value === 'bigint') {
        const num = Number(value);
        return Number.isSafeInteger(num) ? num : value.toString();
    }
    if (Array.isArray(value)) return value.map(toSerializable);
    if (typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, toSerializable(v)])
        );
    }
    return value;
}

export default toSerializable;