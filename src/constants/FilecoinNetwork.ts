import { networkBySlug } from '$/constants/Network.ts'


// Constants

export const filecoinNetworks = [
	{
		slug: 'filecoin',
		caip2: networkBySlug.filecoin.caip2,
		lotusRpcUrl: 'https://api.node.glif.io/rpc/v1',
		filfoxRestBaseUrl: 'https://filfox.info/api/v1',
	},
] as const satisfies readonly {
	slug: keyof Pick<typeof networkBySlug, 'filecoin'>
	caip2: {
		namespace: string
		reference: string
	}
	lotusRpcUrl: string
	filfoxRestBaseUrl: string
}[]


// Lookups

export const filecoinNetworkBySlug = {
	filecoin: filecoinNetworks[0],
}
