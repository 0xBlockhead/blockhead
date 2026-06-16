// Types

export enum ConsensusMechanismId {
	BittensorYumaConsensus = 'BittensorYumaConsensus',
	EthereumBeaconProofOfStake = 'EthereumBeaconProofOfStake',
	NakamotoProofOfWork = 'NakamotoProofOfWork',
	ZcashProofOfWork = 'ZcashProofOfWork',
	FilecoinExpectedConsensus = 'FilecoinExpectedConsensus',
	SolanaProofOfHistoryTowerBft = 'SolanaProofOfHistoryTowerBft',
	CometBft = 'CometBft',
	PolkadotNposBabeGrandpa = 'PolkadotNposBabeGrandpa',
	HyperBft = 'HyperBft',
	LogosBedrock = 'LogosBedrock',
	QuilibriumProofOfMeaningfulWork = 'QuilibriumProofOfMeaningfulWork',
	NearNightshade = 'NearNightshade',
	MoneroRandomXProofOfWork = 'MoneroRandomXProofOfWork',
	DogecoinAuxProofOfWork = 'DogecoinAuxProofOfWork',
	TronDpos = 'TronDpos',
	ZeroGProofOfStake = 'ZeroGProofOfStake',
}


// Constants

const consensusMechanisms = [
	{
		consensusMechanismId: ConsensusMechanismId.BittensorYumaConsensus,
		label: 'Yuma Consensus',
	},
	{
		consensusMechanismId: ConsensusMechanismId.EthereumBeaconProofOfStake,
		label: 'Ethereum beacon proof of stake',
	},
	{
		consensusMechanismId: ConsensusMechanismId.NakamotoProofOfWork,
		label: 'Nakamoto proof of work',
	},
	{
		consensusMechanismId: ConsensusMechanismId.ZcashProofOfWork,
		label: 'Zcash proof of work',
	},
	{
		consensusMechanismId: ConsensusMechanismId.FilecoinExpectedConsensus,
		label: 'Filecoin Expected Consensus',
	},
	{
		consensusMechanismId: ConsensusMechanismId.SolanaProofOfHistoryTowerBft,
		label: 'Proof of History + Tower BFT',
	},
	{
		consensusMechanismId: ConsensusMechanismId.CometBft,
		label: 'CometBFT',
	},
	{
		consensusMechanismId: ConsensusMechanismId.PolkadotNposBabeGrandpa,
		label: 'NPoS + BABE/GRANDPA',
	},
	{
		consensusMechanismId: ConsensusMechanismId.HyperBft,
		label: 'HyperBFT',
	},
	{
		consensusMechanismId: ConsensusMechanismId.LogosBedrock,
		label: 'Logos Bedrock',
	},
	{
		consensusMechanismId: ConsensusMechanismId.QuilibriumProofOfMeaningfulWork,
		label: 'Proof of Meaningful Work',
	},
	{
		consensusMechanismId: ConsensusMechanismId.NearNightshade,
		label: 'Nightshade',
	},
	{
		consensusMechanismId: ConsensusMechanismId.MoneroRandomXProofOfWork,
		label: 'RandomX proof of work',
	},
	{
		consensusMechanismId: ConsensusMechanismId.DogecoinAuxProofOfWork,
		label: 'AuxPoW proof of work',
	},
	{
		consensusMechanismId: ConsensusMechanismId.TronDpos,
		label: 'TRON delegated proof of stake',
	},
	{
		consensusMechanismId: ConsensusMechanismId.ZeroGProofOfStake,
		label: '0G proof of stake consensus',
	},
] as const satisfies readonly {
	consensusMechanismId: ConsensusMechanismId
	label: string
}[]


// Lookups

export const consensusMechanismById = Object.fromEntries(
	consensusMechanisms.map((row) => [
		row.consensusMechanismId,
		row,
	])
)
