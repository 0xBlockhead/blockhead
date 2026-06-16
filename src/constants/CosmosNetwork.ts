import { networkBySlug } from '$/constants/Network.ts'


// Constants

export const cosmosNetworks = [
	{
		slug: 'cosmos',
		caip2: networkBySlug.cosmos.caip2,
		cometBftRestBaseUrl: 'https://cosmos-rpc.publicnode.com',
		cosmosSdkRestBaseUrl: 'https://cosmos-rest.publicnode.com',
	},
] as const satisfies readonly {
	slug: keyof Pick<typeof networkBySlug, 'cosmos'>
	caip2: {
		namespace: string
		reference: string
	}
	cometBftRestBaseUrl: string
	cosmosSdkRestBaseUrl: string
}[]


// Lookups

export const cosmosNetworkBySlug = {
	cosmos: cosmosNetworks[0],
}
