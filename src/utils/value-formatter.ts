
const useFormatter = () => {
  interface DateFormat {
    SHORT: Intl.DateTimeFormatOptions
    LONG: Intl.DateTimeFormatOptions
    LONGER: Intl.DateTimeFormatOptions
  }

  const dateOptions: DateFormat = {
    SHORT: { month: 'short', year: 'numeric' },
    LONG: { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' },
    LONGER: { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit' }
  }

  const parseNumber = (number: string | number = 0.00, options: Intl.NumberFormatOptions = {}) => {
    try {
      if (typeof number === 'string')
        number = Number.parseFloat(number)

      if (number == null || number === undefined || isNaN(number))
        number = 0.00;

      if (number == null) throw new Error('Cannot parse number: Number is NULL')
      return new Intl.NumberFormat("ar-EG", options).format(number)
    } catch (error) {
      console.warn(error)
      return '-1'
    }
  };

  const sizeFormatter = (value = 0) => new Intl.NumberFormat("ar-EG", {
    style: 'unit',
    unit: 'byte',
    notation: "compact",
    unitDisplay: "narrow",
  }).format(value)

  const parseDate = (date: string | Date, options: Intl.DateTimeFormatOptions = dateOptions.LONG): string => {
    try {
      if (!date) throw new Error('Cannot parse date: Date is NULL');

      const formattedDate = date instanceof Date ? date : new Date(date);
      if (isNaN(formattedDate.getTime())) throw new Error('Cannot parse date: Invalid Date');

      return new Intl.DateTimeFormat("ar-EG", options).format(formattedDate);
    } catch (error) {
      console.warn(error);
      return '';
    }
  };

  const encodeParameter = (value: string | number | number[] | string[]): string => {
    if (Array.isArray(value))
      return btoa(encodeURIComponent(JSON.stringify(value)))
    return btoa(encodeURIComponent(String(value)));
  };

  const decodeParameter = <T = string>(
    encoded: string | null | (string | null)[]
  ): T | null => {
    try {
      if (!encoded) return null;

      if (Array.isArray(encoded))
        return encoded.map(item =>
          item ? decodeURIComponent(atob(item)) : null
        ) as unknown as T;

      return decodeURIComponent(atob(encoded)) as unknown as T;
    } catch (error) {
      console.error("Failed to decode parameter:", error);
      return null;
    }
  };

  const encodeQuery = <T extends Record<string, any>>(obj: T): Record<keyof T, string> => {
    const encodedObj = {} as Record<keyof T, string>;

    for (const key in obj)
      if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key])
        encodedObj[key] = encodeParameter(obj[key]);

    return encodedObj;
  };

  const decodeQuery = <T extends Record<string, string>>(encodedObj: Record<keyof T, string>): Record<keyof T, string> => {
    const decodedObj = {} as Record<keyof T, string>;

    for (const key in encodedObj)
      if (Object.prototype.hasOwnProperty.call(encodedObj, key))
        decodedObj[key] = decodeParameter<string>(encodedObj[key]) ?? "";

    return decodedObj;
  };

  const relativeTime = (value = 0, unit: Intl.RelativeTimeFormatUnit = 'days') => {
    try {
      if (value == null) throw new Error('Cannot parse number: Number is NULL')

      return new Intl.RelativeTimeFormat("ar-EG", { numeric: 'auto' }).format(value, unit)
    } catch (error) {
      console.warn(error)
      return ''
    }
  };

  const vuetifyDate = (date: Date) => date.toISOString().slice(0, 16)

  const parsePrice = (price: string | number = 0.00) => {
    try {
      if (typeof price === 'string')
        price = Number.parseFloat(price)

      if (price == null || price === undefined || isNaN(price))
        price = 0.00;

      return new Intl.NumberFormat("ar-EG", {
        style: 'currency',
        currency: 'EGP',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
      }).format(price);
    } catch (error) {
      console.warn(error)
      return 'غير معروف'
    }
  };

  return {
    parseNumber,
    parseDate,
    parsePrice,
    relativeTime,
    vuetifyDate,
    dateOptions,
    sizeFormatter,
    encodeQuery,
    decodeQuery,
    encodeParameter,
    decodeParameter,
  }
}

export {
  useFormatter
}