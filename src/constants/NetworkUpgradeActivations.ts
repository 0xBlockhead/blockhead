/**
 * Per-chain activation metadata; consumed by `NetworkUpgrades.ts`.
 */

// Types
import {
	ConsensusProtocol,
	ExecutionProtocol,
} from '$/schema/NetworkUpgradeProtocols.ts'
import { ProposalCategory } from '$/constants/Proposal.ts'

export type NetworkUpgradeActivationProposal = {
	kind: ProposalCategory
	number: number
}

export type NetworkUpgradeActivation = {
	upgradeId: string
	name?: string
	slug?: string
	activation?: { block?: number; timestamp?: number; epoch?: number }
	forkHash?: string
	executionProtocol?: ExecutionProtocol
	/** Op Stack blob-parameter-only activation (not a full hardfork name). */
	blobParameterOnly?: true
	consensusProtocol?: ConsensusProtocol
	links?: {
		ethereumOrg?: string
		executionSpecs?: string
		consensusSpecs?: string
		forkcast?: string
	}
	proposalIds?: readonly NetworkUpgradeActivationProposal[]
}


// Constants
const EXEC =
	'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades'
const CONS = 'https://github.com/ethereum/consensus-specs/blob/master/specs'
const FORKCAST = 'https://forkcast.org'
const ETH_ORG = 'https://ethereum.org/ethereum-forks'


/**
 * Chain 1 — execution and consensus activation metadata.
 */

export const ethereumMainnetNetworkUpgradeActivations = [
	{
		upgradeId: 'Frontier',
		activation: { block: 1 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#frontier`, executionSpecs: `${EXEC}/frontier.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 1,
			},
		],
	},
	{
		upgradeId: 'Frontier Thawing',
		activation: { block: 200_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#frontier-thawing`, forkcast: FORKCAST },
	},
	{
		upgradeId: 'Homestead',
		activation: { block: 1_150_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#homestead`, executionSpecs: `${EXEC}/homestead.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 606,
			},
		],
	},
	{
		upgradeId: 'DAOFork',
		activation: { block: 1_920_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#dao-fork`, executionSpecs: `${EXEC}/dao-fork.md`, forkcast: FORKCAST },
	},
	{
		upgradeId: 'EIP150',
		activation: { block: 2_463_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#tangerine-whistle`, executionSpecs: `${EXEC}/tangerine-whistle.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 608,
			},
		],
	},
	{
		upgradeId: 'EIP155',
		activation: { block: 2_675_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'EIP158',
		activation: { block: 2_675_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#spurious-dragon`, executionSpecs: `${EXEC}/spurious-dragon.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 607,
			},
		],
	},
	{
		upgradeId: 'Byzantium',
		activation: { block: 4_370_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#byzantium`, executionSpecs: `${EXEC}/byzantium.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 609,
			},
		],
	},
	{
		upgradeId: 'Constantinople',
		activation: { block: 7_280_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#constantinople`, executionSpecs: `${EXEC}/constantinople.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 1013,
			},
		],
	},
	{
		upgradeId: 'Petersburg',
		activation: { block: 7_280_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#petersburg`, executionSpecs: `${EXEC}/petersburg.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 1716,
			},
		],
	},
	{
		upgradeId: 'Istanbul',
		activation: { block: 9_069_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#istanbul`, executionSpecs: `${EXEC}/istanbul.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 1679,
			},
		],
	},
	{
		upgradeId: 'MuirGlacier',
		activation: { block: 9_200_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#muir-glacier`, executionSpecs: `${EXEC}/muir-glacier.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 2384,
			},
		],
	},
	{
		upgradeId: 'Berlin',
		activation: { block: 12_244_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#berlin`, executionSpecs: `${EXEC}/berlin.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 2565,
			},
			{
				kind: ProposalCategory.Eip,
				number: 2929,
			},
			{
				kind: ProposalCategory.Eip,
				number: 2718,
			},
			{
				kind: ProposalCategory.Eip,
				number: 2930,
			},
		],
	},
	{
		upgradeId: 'London',
		activation: { block: 12_965_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#london`, executionSpecs: `${EXEC}/london.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 1559,
			},
			{
				kind: ProposalCategory.Eip,
				number: 3198,
			},
			{
				kind: ProposalCategory.Eip,
				number: 3529,
			},
			{
				kind: ProposalCategory.Eip,
				number: 3541,
			},
		],
	},
	{
		upgradeId: 'ArrowGlacier',
		activation: { block: 13_773_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#arrow-glacier`, executionSpecs: `${EXEC}/arrow-glacier.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 4345,
			},
		],
	},
	{
		upgradeId: 'Gray Glacier',
		activation: { block: 15_050_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#gray-glacier`, executionSpecs: `${EXEC}/gray-glacier.md`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 5133,
			},
		],
	},
	{
		upgradeId: 'Paris',
		name: 'Paris',
		activation: { block: 15_537_394, timestamp: 1_663_224_162 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: {
			ethereumOrg: 'https://ethereum.org/en/history/#paris',
			executionSpecs: `${EXEC}/merge.md`,
			consensusSpecs: `${CONS}/bellatrix/beacon-chain.md`,
			forkcast: FORKCAST,
		},
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 3675,
			},
			{
				kind: ProposalCategory.Eip,
				number: 4399,
			},
		],
	},
	{
		upgradeId: 'Shanghai',
		name: 'Shanghai',
		activation: { timestamp: 1_681_338_455 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#shanghai-capella-shapella`, executionSpecs: `${EXEC}/shanghai.md`, consensusSpecs: `${CONS}/capella/`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 3651,
			},
			{
				kind: ProposalCategory.Eip,
				number: 3855,
			},
			{
				kind: ProposalCategory.Eip,
				number: 3860,
			},
			{
				kind: ProposalCategory.Eip,
				number: 4895,
			},
		],
	},
	{
		upgradeId: 'Cancun',
		name: 'Cancun',
		activation: { timestamp: 1_710_338_135 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#cancun-deneb-dencun`, executionSpecs: `${EXEC}/cancun.md`, consensusSpecs: `${CONS}/deneb/`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 1153,
			},
			{
				kind: ProposalCategory.Eip,
				number: 4844,
			},
			{
				kind: ProposalCategory.Eip,
				number: 4788,
			},
			{
				kind: ProposalCategory.Eip,
				number: 5656,
			},
			{
				kind: ProposalCategory.Eip,
				number: 6780,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7044,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7045,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7514,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7516,
			},
		],
	},
	{
		upgradeId: 'Prague',
		name: 'Prague',
		activation: { timestamp: 1_746_612_311 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#prague-electra-pectra`, executionSpecs: `${EXEC}/prague.md`, consensusSpecs: `${CONS}/electra/`, forkcast: FORKCAST },
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 2537,
			},
			{
				kind: ProposalCategory.Eip,
				number: 2935,
			},
			{
				kind: ProposalCategory.Eip,
				number: 6110,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7002,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7251,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7623,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7685,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7691,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7702,
			},
		],
	},
	{
		upgradeId: 'Osaka',
		name: 'Osaka',
		activation: { timestamp: 1_764_798_551 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: {
			ethereumOrg: 'https://ethereum.org/en/roadmap/fusaka/',
			executionSpecs: `${EXEC}/fusaka.md`,
			consensusSpecs: `${CONS}/fulu/beacon-chain.md`,
			forkcast: FORKCAST,
		},
		proposalIds: [
			{
				kind: ProposalCategory.Eip,
				number: 7594,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7642,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7823,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7825,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7883,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7892,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7910,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7917,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7918,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7934,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7935,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7939,
			},
			{
				kind: ProposalCategory.Eip,
				number: 7951,
			},
		],
	},
	{
		upgradeId: 'Altair',
		name: 'Altair',
		activation: { epoch: 74_240 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: {
			ethereumOrg: 'https://ethereum.org/en/history/#altair',
			consensusSpecs: `${CONS}/altair/beacon-chain.md`,
			forkcast: FORKCAST,
		},
	},
	{
		upgradeId: 'Bellatrix',
		name: 'Bellatrix',
		activation: { epoch: 144_896 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: {
			ethereumOrg: 'https://ethereum.org/en/history/#bellatrix',
			consensusSpecs: `${CONS}/bellatrix/beacon-chain.md`,
			forkcast: FORKCAST,
		},
	},
	{
		upgradeId: 'Capella',
		name: 'Capella',
		activation: { epoch: 194_048 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: {
			ethereumOrg: 'https://ethereum.org/en/history/#capella',
			consensusSpecs: `${CONS}/capella/beacon-chain.md`,
			forkcast: FORKCAST,
		},
	},
	{
		upgradeId: 'Deneb',
		name: 'Deneb',
		activation: { epoch: 269_568 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: {
			ethereumOrg: 'https://ethereum.org/en/history/#deneb',
			consensusSpecs: `${CONS}/deneb/beacon-chain.md`,
			forkcast: FORKCAST,
		},
	},
	{
		upgradeId: 'Electra',
		name: 'Electra',
		activation: { epoch: 364_032 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: {
			ethereumOrg: 'https://ethereum.org/en/history/#electra',
			consensusSpecs: `${CONS}/electra/beacon-chain.md`,
			forkcast: FORKCAST,
		},
	},
	{
		upgradeId: 'Fulu',
		name: 'Fulu',
		activation: { epoch: 411_392 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: {
			ethereumOrg: 'https://ethereum.org/en/roadmap/fusaka/',
			consensusSpecs: `${CONS}/fulu/beacon-chain.md`,
			forkcast: FORKCAST,
		},
	},
] as const

/**
 * Chain 10 — execution and consensus activation metadata.
 */

export const opMainnetNetworkUpgradeActivations = [
	{
		upgradeId: 'Bedrock',
		activation: { timestamp: 1_686_079_703 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Canyon',
		activation: { timestamp: 1_704_992_401 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Delta',
		activation: { timestamp: 1_708_560_000 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Ecotone',
		activation: { timestamp: 1_710_374_401 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Fjord',
		activation: { timestamp: 1_720_627_201 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Granite',
		activation: { timestamp: 1_726_070_401 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Holocene',
		activation: { timestamp: 1_736_445_601 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Isthmus',
		activation: { timestamp: 1_746_806_401 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Jovian',
		activation: { timestamp: 1_764_691_201 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
] as const

/**
 * Chain 8453 — execution and consensus activation metadata.
 */

export const baseMainnetNetworkUpgradeActivations = [
	{
		upgradeId: 'Bedrock',
		activation: { timestamp: 1_686_079_703 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Canyon',
		activation: { timestamp: 1_704_992_401 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Delta',
		activation: { timestamp: 1_708_560_000 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Ecotone',
		activation: { timestamp: 1_710_374_401 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Fjord',
		activation: { timestamp: 1_720_627_201 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Granite',
		activation: { timestamp: 1_726_070_401 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Holocene',
		activation: { timestamp: 1_736_445_601 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Isthmus',
		activation: { timestamp: 1_746_806_401 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Jovian',
		activation: { timestamp: 1_764_691_201 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
] as const

/**
 * Chain 17000 — execution and consensus activation metadata.
 */

export const holeskyNetworkUpgradeActivations = [
	{
		upgradeId: 'Homestead',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'EIP150',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'EIP155',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'EIP158',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Byzantium',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Constantinople',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Petersburg',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Istanbul',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Berlin',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'London',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Paris',
		name: 'Paris',
		activation: { block: 0, timestamp: 1_695_996_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { executionSpecs: `${EXEC}/merge.md`, consensusSpecs: `${CONS}/bellatrix/beacon-chain.md` },
	},
	{
		upgradeId: 'Shanghai',
		activation: { timestamp: 1_696_000_704 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Cancun',
		activation: { timestamp: 1_707_305_664 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Prague',
		name: 'Prague',
		activation: { timestamp: 1_740_387_840 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { executionSpecs: `${EXEC}/prague.md`, consensusSpecs: `${CONS}/electra/` },
	},
	{
		upgradeId: 'Osaka',
		name: 'Osaka',
		activation: { timestamp: 1_759_296_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { executionSpecs: `${EXEC}/fusaka.md`, consensusSpecs: `${CONS}/fulu/beacon-chain.md` },
	},
	{
		upgradeId: 'Bellatrix',
		name: 'Bellatrix',
		activation: { epoch: 0 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: { consensusSpecs: `${CONS}/bellatrix/beacon-chain.md` },
	},
	{
		upgradeId: 'Capella',
		name: 'Capella',
		activation: { epoch: 256 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: { consensusSpecs: `${CONS}/capella/` },
	},
	{
		upgradeId: 'Deneb',
		name: 'Deneb',
		activation: { epoch: 29_696 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: { consensusSpecs: `${CONS}/deneb/` },
	},
	{
		upgradeId: 'Electra',
		name: 'Electra',
		activation: { epoch: 115_968 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: { consensusSpecs: `${CONS}/electra/` },
	},
	{
		upgradeId: 'Fulu',
		name: 'Fulu',
		activation: { epoch: 165_120 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: { consensusSpecs: `${CONS}/fulu/beacon-chain.md` },
	},
] as const

/**
 * Chain 84532 — execution and consensus activation metadata.
 */

export const baseSepoliaNetworkUpgradeActivations = [
	{
		upgradeId: 'Canyon',
		activation: { timestamp: 1_699_981_200 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Delta',
		activation: { timestamp: 1_703_203_200 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Ecotone',
		activation: { timestamp: 1_708_534_800 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Fjord',
		activation: { timestamp: 1_716_998_400 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Granite',
		activation: { timestamp: 1_723_478_400 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Holocene',
		activation: { timestamp: 1_732_633_200 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Prague blob schedule',
		blobParameterOnly: true,
		activation: { timestamp: 1_742_486_400 },
	},
	{
		upgradeId: 'Isthmus',
		activation: { timestamp: 1_744_905_600 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Jovian',
		activation: { timestamp: 1_763_568_001 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
] as const

/**
 * Chain 11155111 — execution and consensus activation metadata.
 */

export const sepoliaNetworkUpgradeActivations = [
	{
		upgradeId: 'Homestead',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'EIP150',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'EIP155',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'EIP158',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Byzantium',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Constantinople',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Petersburg',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Istanbul',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'MuirGlacier',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Berlin',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'London',
		activation: { block: 0 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Paris',
		name: 'Paris',
		activation: { block: 1_735_371, timestamp: 1_676_323_200 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: {
			ethereumOrg: `${ETH_ORG}/#paris`,
			executionSpecs: `${EXEC}/merge.md`,
			consensusSpecs: `${CONS}/bellatrix/beacon-chain.md`,
			forkcast: FORKCAST,
		},
	},
	{
		upgradeId: 'Shanghai',
		activation: { timestamp: 1_677_557_088 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Cancun',
		activation: { timestamp: 1_706_655_072 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		upgradeId: 'Prague',
		name: 'Prague',
		activation: { timestamp: 1_741_162_176 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { executionSpecs: `${EXEC}/prague.md`, consensusSpecs: `${CONS}/electra/` },
	},
	{
		upgradeId: 'Osaka',
		name: 'Osaka',
		activation: { timestamp: 1_760_422_560 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { executionSpecs: `${EXEC}/fusaka.md`, consensusSpecs: `${CONS}/fulu/beacon-chain.md` },
	},
	{
		upgradeId: 'Altair',
		name: 'Altair',
		activation: { epoch: 50 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: { consensusSpecs: `${CONS}/altair/beacon-chain.md` },
	},
	{
		upgradeId: 'Bellatrix',
		name: 'Bellatrix',
		activation: { epoch: 100 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: { consensusSpecs: `${CONS}/bellatrix/beacon-chain.md` },
	},
	{
		upgradeId: 'Capella',
		name: 'Capella',
		activation: { epoch: 56_832 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: { consensusSpecs: `${CONS}/capella/` },
	},
	{
		upgradeId: 'Deneb',
		name: 'Deneb',
		activation: { epoch: 132_608 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: { consensusSpecs: `${CONS}/deneb/` },
	},
	{
		upgradeId: 'Electra',
		name: 'Electra',
		activation: { epoch: 222_464 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: { consensusSpecs: `${CONS}/electra/` },
	},
	{
		upgradeId: 'Fulu',
		name: 'Fulu',
		activation: { epoch: 272_640 },
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
		links: { consensusSpecs: `${CONS}/fulu/beacon-chain.md` },
	},
] as const

/**
 * Chain 11155420 — execution and consensus activation metadata.
 */

export const opSepoliaNetworkUpgradeActivations = [
	{
		upgradeId: 'Canyon',
		activation: { timestamp: 1_699_981_200 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Delta',
		activation: { timestamp: 1_703_203_200 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Ecotone',
		activation: { timestamp: 1_708_534_800 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Fjord',
		activation: { timestamp: 1_716_998_400 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Granite',
		activation: { timestamp: 1_723_478_400 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Holocene',
		activation: { timestamp: 1_732_633_200 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Prague blob schedule',
		blobParameterOnly: true,
		activation: { timestamp: 1_742_486_400 },
	},
	{
		upgradeId: 'Isthmus',
		activation: { timestamp: 1_744_905_600 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
	{
		upgradeId: 'Jovian',
		activation: { timestamp: 1_763_568_001 },
		executionProtocol: ExecutionProtocol.OpStack,
	},
] as const
