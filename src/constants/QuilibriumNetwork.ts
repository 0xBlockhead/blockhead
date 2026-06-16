import { TransportType } from '$/constants/TransportType.ts'


// Constants

export const quilibriumNodeInterfaces = [
	{
		label: 'Node gRPC',
		port: 8337,
		transportType: TransportType.Http,
	},
	{
		label: 'Node REST',
		port: 8338,
		transportType: TransportType.Http,
	},
] as const satisfies readonly {
	label: string
	port: number
	transportType: TransportType
}[]

export const quilibriumProtocolFacts = [
	{
		label: 'Frame cadence',
		value: '10 seconds',
	},
	{
		label: 'Consensus',
		value: 'Proof of Meaningful Work',
	},
	{
		label: 'Execution',
		value: 'QCL and intrinsic execution',
	},
	{
		label: 'Storage',
		value: 'Hypergraph and RDF-style data model',
	},
] as const satisfies readonly {
	label: string
	value: string
}[]

export const quilibriumServiceLayers = [
	{
		label: 'Hypergraph',
		description: 'Global state and application data graph.',
	},
	{
		label: 'QCL',
		description: 'Quilibrium contract language and execution model.',
	},
	{
		label: 'QKMS',
		description: 'Key-management and access-control service.',
	},
	{
		label: 'QStorage',
		description: 'Storage service integrated with the network data model.',
	},
] as const satisfies readonly {
	label: string
	description: string
}[]
