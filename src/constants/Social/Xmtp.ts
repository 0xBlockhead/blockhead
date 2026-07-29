import { XmtpConversationConsentState } from '$/schema/XmtpConversationConsentState.ts'


// Constants
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
	])
)
