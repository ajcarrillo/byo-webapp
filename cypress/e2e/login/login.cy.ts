describe('Login', function() {
  beforeAll(() => {
    cy.fixture('redux-state-authentication').then(function (data) {
      this.reduxStateAuthentication = data
    })
    cy.fixture('redux-state-proteus').then(function (data) {
      this.reduxStateProteus= data
    })
  })
  
  it('should load without crashing', function() {
    cy.visit('http://localhost:3000/sign-in')
  })

  it('should have the correct initial redux state', function() {
    const authenticationState = {
      apiError: null,
      authenticationLoading: false,
      userAddress: undefined,
      accessToken: undefined,
      accessTokenValid: false,
      signupComplete: false,
      emailResent: false,
      confirmingEmail: false,
      emailConfirmed: false,
      passwordResetRequested: false,
      passwordChanged: false,
      saveUserDetailsApiError: null,
      userDetails: null,
    }

    const proteusState = {
      apiError: null,
      modulesLoading: false,
      version: undefined,
      modules: null,
      controllerConnectionError: undefined,
      connectedController: null,
    }

    cy.visit('http://localhost:3000/sign-in')
    cy.window()
      .its('store')
      .invoke('getState')
      .should('deep.equal', { authentication: authenticationState, proteus: proteusState })
  })
})