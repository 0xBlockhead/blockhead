import type {
	LogosDocsNetworkSummary,
	LogosDocsPage,
	LogosDocsZoneSummary,
} from '$/sources/LogosDocs/Rest/types.ts'
import { getText } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/LogosDocs/bindings.ts'
import { Source } from '$/sources/Source.ts'

const logosDocsBaseUrl = 'https://docs.logoslabs.io'
const binding = bindings[Source.LogosDocs_Rest][0]

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

const assertLogosTestnet = (networkSlug: string) => {
	if (networkSlug !== 'logos-testnet')
		throw new Error(`LogosDocs_Rest: unsupported network: ${networkSlug}`)
}

export const getNetworkSummary = ({ networkSlug }: { networkSlug: string }) => {
	assertLogosTestnet(networkSlug)

	return {
		chainFramework: 'Substrate',
		networkRole: 'sub0layer',
		primaryComponents: [
			'DVCI',
			'Logos Chain',
			'Network Gatekeeper',
			'W3bI',
		],
	} as const satisfies LogosDocsNetworkSummary
}

export const getZoneSummary = ({
	networkSlug,
	zoneId,
}: {
	networkSlug: string
	zoneId: string
}) => {
	assertLogosTestnet(networkSlug)

	if (zoneId === 'Logos Chain')
		return {
			zoneId,
			zoneKind: 'blockchain',
		} as const satisfies LogosDocsZoneSummary

	if (zoneId === 'DVCI')
		return {
			zoneId,
			zoneKind: 'distributed-virtual-computing-infrastructure',
		} as const satisfies LogosDocsZoneSummary

	if (zoneId === 'Network Gatekeeper')
		return {
			zoneId,
			zoneKind: 'access-control',
		} as const satisfies LogosDocsZoneSummary

	if (zoneId === 'W3bI')
		return {
			zoneId,
			zoneKind: 'computation-distribution-regulator',
		} as const satisfies LogosDocsZoneSummary

	throw new Error(`LogosDocs_Rest: unsupported zone: ${zoneId}`)
}

export const getPage = ({ url }: { url: string }) => {
	if (!url.startsWith(`${logosDocsBaseUrl}/`))
		throw new Error(`LogosDocs_Rest: url outside docs origin: ${url}`)

	return getText(binding, url.slice(logosDocsBaseUrl.length) || '/')
}
