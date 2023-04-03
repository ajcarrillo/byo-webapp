import { ShopCountry } from '../types/shop-types'

/**
 * Transforms an array of countries from the database
 * @param countries An array of countries from the database
 * @returns An array of transformed country data
 */
const transformCountriesFromDB = (countries: any[]): ShopCountry[] => {
  const output: ShopCountry[] = countries.filter(c => c.supported === 1).map(c => {
    return {
      phonePrefix: c.phone,
      code: c.code,
      name: c.name,
      currenySymbol: c.symbol,
      currency: c.currency,
      iso: c.alpha_3,
      supported: c.spported === 1 ? true : false,
    }
  })
  return output
}

export {
  transformCountriesFromDB
}