import type {
	LogosDocsNetworkSummary,
	LogosDocsPage,
} from '$/sources/LogosDocs/Rest/types.ts'

export const getPages = [
	{
		url: 'https://docs.logoslabs.io/learn/logos/aboutLogosNetwork',
		title: 'About Logos network',
	},
	{
		url: 'https://docs.logoslabs.io/development/dev-overview',
		title: 'Development overview',
	},
	{
		url: 'https://docs.logoslabs.io/learn/substrate/sub-structure',
		title: 'Substrate overview',
	},
] satisfies readonly LogosDocsPage[]

export const getNetworkSummary = {
	chainFramework: 'Substrate',
	networkRole: 'sub0layer',
	primaryComponents: [
		'DVCI',
		'Logos Chain',
		'Network Gatekeeper',
		'W3bI',
	],
} satisfies LogosDocsNetworkSummary
