import { ShopAmericanState, ShopCountry, ShopSalesTransaction } from '../types/shop-types'

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

/**
 * Transforms an array of American states from the database
 * @param states An array of states
 * @returns An array of transformed state data
 */
const transformAmericanStatesFromDB = (states: any[]): ShopAmericanState[] => {
  const output: ShopAmericanState[] = states.map(s => {
    return {
      code: s.state_code,
      name: s.state_name,
    }
  })
  return output
}

/**
 * Transaforms a Stripe formatted billing address in a sales transaction to a user contact formatted address
 * @param transaction The sales transaction from the microservice
 * @returns A properly formatted sales transaction object
 */
const transformStripeSalesTransaction = (transaction: any): ShopSalesTransaction => {
  const output: ShopSalesTransaction = {
    stripeClientSecret: transaction.stripeClientSecret,
    salesAmount: transaction.salesAmount,
    transactionStatus: transaction.transactionStatus,
    transactionId: transaction.transactionId,
    taxAddress: {
      addressLine1: transaction.taxAddress.line1,
      townCity: transaction.taxAddress.city,
      countryCode: transaction.taxAddress.country,
      zipPostcode: transaction.taxAddress.postal_code,
      ...(transaction.taxAddress.state && {regionCounty: transaction.taxAddress.state}),
    },
  }
  return output
}

export {
  transformAmericanStatesFromDB,
  transformCountriesFromDB,
  transformStripeSalesTransaction
}
