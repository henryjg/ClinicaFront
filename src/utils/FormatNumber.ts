const formatWithCommas = (value: string): string => {
    // Función para agregar comas como separadores de miles
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

const formatNumber = (number: string): string => {
    // Remover cualquier carácter no numérico excepto puntos y comas
    let value = number.replace(/,/g, '').replace(/[^\d.]/g, '');

    // Convertir a número y formatear
    if (value) {
        value = parseFloat(value).toFixed(2);
        number = formatWithCommas(value);
    } else {
        number = "0.00";
    }
    return number;
}

const NumberFormat = {
    formatNumber
}

export default NumberFormat;
