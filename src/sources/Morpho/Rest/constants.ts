/**
 * Morpho Blue deployment catalog (official addresses).
 * @see https://docs.morpho.org/get-started/resources/addresses/#morpho-blue
 * @see https://docs.morpho.org/developers/api/morpho/
 */


// Types


type MorphoBlueDeployment = {
	chainId: number
	name: string
	morpho: `0x${string}`
	adaptiveCurveIrm: `0x${string}`
}


// Constants


/** Morpho Blue singleton + AdaptiveCurveIRM per documented EIP-155 chain. */
export const morphoBlueDeployments = [
	{
		chainId: 1,
		name: 'Ethereum',
		morpho: '0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb',
		adaptiveCurveIrm: '0x870ac11d48b15db9a138cf899d20f13f79ba00bc',
	},
	{
		chainId: 8453,
		name: 'Base',
		morpho: '0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb',
		adaptiveCurveIrm: '0x46415998764c29ab2a25cbea6254146d50d22687',
	},
] as const satisfies readonly MorphoBlueDeployment[]

/** Morpho Blue market id (bytes32). */
export const morphoMarketIdPattern = /^0x[0-9a-fA-F]{64}$/


// Lookups


export const morphoBlueByChainId = Object.fromEntries(
	morphoBlueDeployments.map((deployment) => [
		deployment.chainId,
		deployment,
	])
)
