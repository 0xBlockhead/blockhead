// Types

export enum ExecutionEnvironmentId {
	BittensorSubtensorRuntime = 'BittensorSubtensorRuntime',
	Evm = 'Evm',
	LightningProtocol = 'LightningProtocol',
	SolanaSvm = 'SolanaSvm',
	FilecoinVm = 'FilecoinVm',
	CosmWasm = 'CosmWasm',
	SubstrateRuntime = 'SubstrateRuntime',
	HyperEvm = 'HyperEvm',
	LogosBlockchainRuntime = 'LogosBlockchainRuntime',
	NearRuntime = 'NearRuntime',
	QuilibriumQcl = 'QuilibriumQcl',
	BitcoinScript = 'BitcoinScript',
	BitcoinCashScript = 'BitcoinCashScript',
	ElementsScript = 'ElementsScript',
	TronTvm = 'TronTvm',
	ZeroGChainEvm = 'ZeroGChainEvm',
	ZeroGServingFramework = 'ZeroGServingFramework',
}


// Constants

const executionEnvironments = [
	{
		executionEnvironmentId: ExecutionEnvironmentId.BittensorSubtensorRuntime,
		label: 'Subtensor runtime',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.Evm,
		label: 'EVM',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.LightningProtocol,
		label: 'Lightning payment-channel protocol',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.SolanaSvm,
		label: 'Solana SVM',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.FilecoinVm,
		label: 'Filecoin VM',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.CosmWasm,
		label: 'CosmWasm',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.SubstrateRuntime,
		label: 'Substrate runtime',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.HyperEvm,
		label: 'HyperEVM',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.LogosBlockchainRuntime,
		label: 'Logos blockchain runtime',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.NearRuntime,
		label: 'NEAR runtime',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.QuilibriumQcl,
		label: 'Quilibrium QCL',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.BitcoinScript,
		label: 'Bitcoin Script',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.BitcoinCashScript,
		label: 'Bitcoin Cash Script',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.ElementsScript,
		label: 'Elements Script',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.TronTvm,
		label: 'TRON Virtual Machine',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.ZeroGChainEvm,
		label: '0G Chain EVM',
	},
	{
		executionEnvironmentId: ExecutionEnvironmentId.ZeroGServingFramework,
		label: '0G Serving framework',
	},
] as const satisfies readonly {
	executionEnvironmentId: ExecutionEnvironmentId
	label: string
}[]


// Lookups

export const executionEnvironmentByExecutionEnvironmentId = Object.fromEntries(
	executionEnvironments.map((row) => [
		row.executionEnvironmentId,
		row,
	]),
)
