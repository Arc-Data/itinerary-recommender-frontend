const truncateDecimals = (number, decimalPlaces) => {
    console.log(typeof(number))
    const multiplier = Math.pow(10, decimalPlaces)
    return Math.trunc(number * multiplier) / multiplier
}

export default truncateDecimals