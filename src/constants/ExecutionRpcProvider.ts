/** RPC endpoint attribution (subset of ethglobal DataSourceId used on execution URLs). */

export enum ExecutionRpcProvider {
	Unknown = 'Unknown',
	Local = 'Local',
	NetworkDefault = 'NetworkDefault',
	LlamaNodes = 'LlamaNodes',
	Alchemy = 'Alchemy',
	PublicNode = 'PublicNode',
	BuidlGuidl = 'BuidlGuidl',
}
