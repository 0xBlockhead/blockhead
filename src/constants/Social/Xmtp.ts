import { XmtpConversationConsentState } from '$/schema/XmtpConversation.ts'


// Constants
export const xmtpNetworkFieldValues = {
	docsUrl: 'https://docs.xmtp.org',
	homeUrl: 'https://xmtp.org',
	protocolName: 'XMTP (wallet messaging)',
	registryLabel: 'Session-local wallets + conversations',
	topology: 'Constants metadata + session-local -> network -> conversations',
} as const

const xmtpConversationConsentStates = [
	{
		consentState: XmtpConversationConsentState.Unknown,
		label: 'Unknown',
	},
	{
		consentState: XmtpConversationConsentState.Allowed,
		label: 'Allowed',
	},
	{
		consentState: XmtpConversationConsentState.Denied,
		label: 'Denied',
	},
] as const satisfies readonly {
	consentState: XmtpConversationConsentState
	label: string
}[]


// Lookups

export const xmtpConversationConsentStateByConsentState = Object.fromEntries(
	xmtpConversationConsentStates.map((row) => [
		row.consentState,
		row,
	]),
)
