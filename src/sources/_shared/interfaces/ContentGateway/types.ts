export enum ContentGatewayFamily {
	Ipfs = 'Ipfs',
	Swarm = 'Swarm',
	Arweave = 'Arweave',
}

export type ContentGatewayTarget = {
	family: ContentGatewayFamily
	resource: string
	path?: string
}
