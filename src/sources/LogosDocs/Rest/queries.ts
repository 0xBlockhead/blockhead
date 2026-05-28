import { getText } from '$/lib/http.ts'
import LogosDocs from '$/sources/LogosDocs/index.ts'
import type {
	LogosDocsNetworkSummary,
	LogosDocsPage,
} from '$/sources/LogosDocs/Rest/types.ts'

const logosDocsBaseUrl = 'https://docs.logoslabs.io'

export const logosDocsPages = [
	{
		url: `${logosDocsBaseUrl}/learn/logos/aboutLogosNetwork`,
		title: 'About Logos network',
	},
	{
		url: `${logosDocsBaseUrl}/development/dev-overview`,
		title: 'Development overview',
	},
	{
		url: `${logosDocsBaseUrl}/learn/substrate/sub-structure`,
		title: 'Substrate overview',
	},
] as const satisfies readonly LogosDocsPage[]

export const logosDocsNetworkSummary = {
	chainFramework: 'Substrate',
	networkRole: 'sub0layer',
	primaryComponents: [
		'DVCI',
		'Logos Chain',
		'Network Gatekeeper',
		'W3bI',
	],
} as const satisfies LogosDocsNetworkSummary

export const getLogosDocsPage = ({ url }: { url: string }) => (
	getText(url, {
		origins: LogosDocs.origins ?? [],
	})
)
