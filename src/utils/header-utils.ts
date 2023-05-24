import { MenuItem } from '../components/Framework/Header/Header'

/**
 * Generates the correct links for the burger menu
 * @param isLoggedIn Is user logged in
 * @param isSmallScreen Is small screen
 * @param userAddress The user address
 * @param userAddress The web browser name
 */
const getBurgerMenuItems = (isLoggedIn: boolean, isSmallScreen: boolean, userAddress: string | null, browser: string): MenuItem[] => {
  const items: MenuItem[] = [
    ... isSmallScreen ? [{url: '/accessibility', title: 'Accessibility', icon: 'fa-solid fa-palette'}] : [],
    ... isSmallScreen ? [{url: '/shop', title: 'Shop', icon: 'fa-solid fa-cart-shopping'}] : [],
    ... isLoggedIn ? [{url: '/orders', title: 'Orders', icon: 'fa-solid fa-truck-fast'}] : [],
    ... isSmallScreen ? [{url: '/basket', title: 'Basket', icon: 'fa-solid fa-basket-shopping'}] : [],
    ... isLoggedIn ? [{url: `/profile/${userAddress}`, title: 'Profile', icon: 'fa-solid fa-user'}] : [],
    ... isLoggedIn ? [{url: '/profile-settings', title: 'Profile Settings', icon: 'fa-solid fa-user-gear'}] : [],
    ... isLoggedIn && browser === 'Chrome' ? [{url: '/proteus', title: 'Proteus', icon: 'fa-solid fa-gamepad'}] : [],
    ... isLoggedIn ? [{url: '/sign-out', title: 'Sign Out', icon: 'fa-solid fa-arrow-right-to-bracket'}] : [],
    ... isSmallScreen && !isLoggedIn ? [{url: '/sign-up', title: 'Sign Up', icon: 'fa-solid fa-user'}] : [],
    ... isSmallScreen && !isLoggedIn ? [{url: '/sign-in', title: 'Sign In', icon: 'fa-solid fa-arrow-right-to-bracket'}] : [],
  ]
  return items
}

export {
  getBurgerMenuItems
}