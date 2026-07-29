import { MediaTransport } from '$/schema/MediaTransport.ts'
import { ipfsPublicGateways } from '$/constants/IpfsProtocol.ts'
import { parseIpfsCid } from '$/lib/multiformats.ts'

const arweaveGatewayOrigin = 'https://arweave.net' as const
const ipfsPublicGatewayOrigin = ipfsPublicGateways[0].origin

const ipfsGatewayPatterns = ipfsPublicGateways.flatMap(({ origin }) => (
	[
		{
			re: new RegExp(`^${origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/ipfs/(?<path>[^?#]+)(?<suffix>[?#].*)?$`, 'i'),
		},
		{
			re: new RegExp(`^https?://(?<path>[^./?#]+)\\.ipfs\\.${new URL(origin).hostname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?<suffix>[/?#].*)?$`, 'i'),
		},
	]
))

const arweaveGatewayPattern = /^https?:\/\/arweave\.net\/(?<path>[^?#]+)(?<suffix>[?#].*)?$/i
const arweaveTransactionIdPattern = /^[a-zA-Z0-9_-]{43}$/

const pathWithSuffix = (path: string, suffix: string | undefined) => (
	`${path.replace(/^\/+/, '')}${suffix ?? ''}`
)

export const resolveMediaUrlTransport = (value: string | null | undefined) => {
	const raw = typeof value === 'string' ? value.trim() : ''
	if (raw.length === 0) return undefined

	const withProtocol = raw.startsWith('//') ? `https:${raw}` : raw
	if (withProtocol.startsWith('ipfs://'))
		return ({
			url: `${ipfsPublicGatewayOrigin}/ipfs/${pathWithSuffix(withProtocol.slice('ipfs://'.length), undefined)}`,
			transport: MediaTransport.Ipfs,
		})

	if (withProtocol.startsWith('ar://'))
		return ({
			url: `${arweaveGatewayOrigin}/${pathWithSuffix(withProtocol.slice('ar://'.length), undefined)}`,
			transport: MediaTransport.Arweave,
		})

	const ipfsGatewayMatch = ipfsGatewayPatterns
		.map(({ re }) => re.exec(withProtocol))
		.find((match) => match != null)
	if (ipfsGatewayMatch?.groups?.path != null)
		return {
			url: `${ipfsPublicGatewayOrigin}/ipfs/${pathWithSuffix(ipfsGatewayMatch.groups.path, ipfsGatewayMatch.groups.suffix)}`,
			transport: MediaTransport.Ipfs,
		}

	const arweaveGatewayMatch = arweaveGatewayPattern.exec(withProtocol)
	if (arweaveGatewayMatch?.groups?.path != null)
		return {
			url: `${arweaveGatewayOrigin}/${pathWithSuffix(arweaveGatewayMatch.groups.path, arweaveGatewayMatch.groups.suffix)}`,
			transport: MediaTransport.Arweave,
		}

	if (parseIpfsCid(withProtocol) != null)
		return {
			url: `${ipfsPublicGatewayOrigin}/ipfs/${withProtocol}`,
			transport: MediaTransport.Ipfs,
		}
	if (arweaveTransactionIdPattern.test(withProtocol))
		return {
			url: `${arweaveGatewayOrigin}/${withProtocol}`,
			transport: MediaTransport.Arweave,
		}

	try {
		const parsed = new URL(withProtocol)
		return (
			parsed.protocol === 'http:' || parsed.protocol === 'https:' ?
				{
					url: parsed.toString(),
					transport: MediaTransport.Http,
				}
			:
				undefined
		)
	} catch {
		return undefined
	}
}
