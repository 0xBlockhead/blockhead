/**
 * Ethereum mainnet forks. Activation blocks/timestamps/epochs per EIP-6953, execution-specs, consensus-specs, and fork meta EIPs (e.g. EIP-7600 Pectra, EIP-7607 Fusaka). Paris block from TTD. Links and proposalIds from ethereum.org/ethereum-forks and fork meta EIPs.
 */

import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { Fork } from '$/constants/Forks/ForkTypes.ts'
import { ethereumExecutionForkFromRow } from '$/constants/Forks/ForkTypes.ts'
import {
	ConsensusProtocol,
	ExecutionProtocol,
	ForkScheduleKind,
} from '$/schema/NetworkFork.ts'
import { ProposalCategory } from '$/constants/Proposal.ts'

const EXEC =
	'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades'
const CONS = 'https://github.com/ethereum/consensus-specs/blob/master/specs'
const FORKCAST = 'https://forkcast.org'
const ETH_ORG = 'https://ethereum.org/ethereum-forks'

export enum ForkId {
	Frontier = 'Frontier',
	FrontierThawing = 'Frontier Thawing',
	Homestead = 'Homestead',
	DAOFork = 'DAOFork',
	EIP150 = 'EIP150',
	EIP155 = 'EIP155',
	EIP158 = 'EIP158',
	Byzantium = 'Byzantium',
	Constantinople = 'Constantinople',
	Petersburg = 'Petersburg',
	Istanbul = 'Istanbul',
	MuirGlacier = 'MuirGlacier',
	Berlin = 'Berlin',
	London = 'London',
	ArrowGlacier = 'ArrowGlacier',
	GrayGlacier = 'Gray Glacier',
	Paris = 'Paris',
	Shanghai = 'Shanghai',
	Cancun = 'Cancun',
	Prague = 'Prague',
	Osaka = 'Osaka',
	Altair = 'Altair',
	Bellatrix = 'Bellatrix',
	Capella = 'Capella',
	Deneb = 'Deneb',
	Electra = 'Electra',
	Fulu = 'Fulu',
}

const forkRows: readonly Fork<ForkId>[] = [
	{
		forkId: ForkId.Frontier,
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
		forkId: ForkId.FrontierThawing,
		activation: { block: 200_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#frontier-thawing`, forkcast: FORKCAST },
	},
	{
		forkId: ForkId.Homestead,
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
		forkId: ForkId.DAOFork,
		activation: { block: 1_920_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#dao-fork`, executionSpecs: `${EXEC}/dao-fork.md`, forkcast: FORKCAST },
	},
	{
		forkId: ForkId.EIP150,
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
		forkId: ForkId.EIP155,
		activation: { block: 2_675_000 },
		executionProtocol: ExecutionProtocol.Ethereum,
	},
	{
		forkId: ForkId.EIP158,
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
		forkId: ForkId.Byzantium,
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
		forkId: ForkId.Constantinople,
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
		forkId: ForkId.Petersburg,
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
		forkId: ForkId.Istanbul,
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
		forkId: ForkId.MuirGlacier,
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
		forkId: ForkId.Berlin,
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
		forkId: ForkId.London,
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
		forkId: ForkId.ArrowGlacier,
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
		forkId: ForkId.GrayGlacier,
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
		forkId: ForkId.Paris,
		activation: { block: 15_537_394 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#paris`, executionSpecs: `${EXEC}/merge.md`, consensusSpecs: `${CONS}/bellatrix/`, forkcast: FORKCAST },
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
		forkId: ForkId.Shanghai,
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
		forkId: ForkId.Cancun,
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
		forkId: ForkId.Prague,
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
		forkId: ForkId.Osaka,
		activation: { timestamp: 1_764_798_551 },
		executionProtocol: ExecutionProtocol.Ethereum,
		links: { ethereumOrg: `${ETH_ORG}/#fulu-osaka-fusaka`, executionSpecs: `${EXEC}/fusaka.md`, forkcast: FORKCAST },
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
		forkId: ForkId.Altair,
		activation: { epoch: 74_240 },
		kind: ForkScheduleKind.Consensus,
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
	},
	{
		forkId: ForkId.Bellatrix,
		activation: { epoch: 144_896 },
		kind: ForkScheduleKind.Consensus,
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
	},
	{
		forkId: ForkId.Capella,
		activation: { epoch: 194_048 },
		kind: ForkScheduleKind.Consensus,
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
	},
	{
		forkId: ForkId.Deneb,
		activation: { epoch: 269_568 },
		kind: ForkScheduleKind.Consensus,
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
	},
	{
		forkId: ForkId.Electra,
		activation: { epoch: 364_032 },
		kind: ForkScheduleKind.Consensus,
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
	},
	{
		forkId: ForkId.Fulu,
		activation: { epoch: 411_392 },
		kind: ForkScheduleKind.Consensus,
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
	},
] as const satisfies readonly Fork<ForkId>[]

const chainId = 1 as const

export const ethereumExecutionForks: readonly Entity<typeof schema, EntityType.NetworkFork>[] = forkRows.map((row) => (
	ethereumExecutionForkFromRow(chainId, row)
))
