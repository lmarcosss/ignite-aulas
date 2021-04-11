
export function formatMoney(
    value: number,
    locale: string = 'pt-BR',
    style: string = 'currency',
    currency: string = 'BRL',
    ) {
    return new Intl.NumberFormat(locale, {
        style,
        currency,
    }).format(value)
}