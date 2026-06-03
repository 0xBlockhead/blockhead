import { getText } from '$/lib/http.ts'
import LogosDocs from '$/sources/LogosDocs/index.ts'
import type {
	LogosDocsNetworkSummary,
	LogosDocsPage,
} from '$/sources/LogosDocs/Rest/types.ts'

const logosDocsBaseUrl = 'https://docs.logoslabs.io'

export const getPages = [
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

export const getNetworkSummary = {
	chainFramework: 'Substrate',
	networkRole: 'sub0layer',
	primaryComponents: [
		'DVCI',
		'Logos Chain',
		'Network Gatekeeper',
		'W3bI',
	],
} as const satisfies LogosDocsNetworkSummary

export const getPage = ({ url }: { url: string }) => (
	getText(url, {
		origins: LogosDocs.origins,
	})
)
