import { Session, getDefaultSession } from '@inrupt/solid-client-authn-browser'

const session: Session = getDefaultSession()

const defaultClientName: string = 'Solid-To-Do'

async function login(issuer: string): Promise<void> {
  await session.login({
    clientName: defaultClientName,
    oidcIssuer: issuer,
    redirectUrl: location.href
  })
}

async function logout(): Promise<void> {
  if (session.info.isLoggedIn) {
    await session.logout()
    location.reload()
  }
}

await session.handleIncomingRedirect({
  restorePreviousSession: true,
  url: location.href
})

export { session, login, logout }
