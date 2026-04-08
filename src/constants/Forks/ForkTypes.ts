/**
 * Fork source row shape (per-chain files) and row → `Entity<typeof schema, EntityType.NetworkFork>`.
 */

import { type Entity, schema } from '$/schema/$schema.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type {
	ConsensusProtocol,
	ExecutionProtocol,
	ForkScheduleKind,
} from '$/schema/NetworkFork.ts'
import type { ProposalCategory } from '$/constants/Proposal/ProposalCategory.ts'
import { ProposalRealm } from '$/constants/Proposal/ProposalRealm.ts'


// Types
export type ForkProposalRef = {
	kind: ProposalCategory
	number: number
}

export type Fork<T extends string = string> = {
	forkId: T
	slug?: string
	activation?: { block?: number; timestamp?: number; epoch?: number }
	forkHash?: string
	kind?: ForkScheduleKind
	executionProtocol?: ExecutionProtocol
	consensusProtocol?: ConsensusProtocol
	links?: {
		ethereumOrg?: string
		executionSpecs?: string
		consensusSpecs?: string
		forkcast?: string
	}
	proposalIds?: readonly ForkProposalRef[]
}


// Functions
/** `#id.forkId` is the stable fork name (`ForkId` value), not the URL slug. */
export const ethereumExecutionForkFromRow = <T extends string>(
	chainId: number,
	row: Fork<T>,
): Entity<typeof schema, EntityType.NetworkFork> => {
	const {
		forkId,
		slug: slugEntry,
		activation,
		links,
		proposalIds,
		...rest
	} = row
	return {
		[EntityMetaKey.Id]: { $network: { chainId }, forkId },
		...rest,
		name: forkId,
		slug: slugEntry ?? String(forkId).toLowerCase().replace(/\s+/g, '-'),
		...(activation?.block != null ? { activationBlock: activation.block } : {}),
		...(activation?.timestamp != null ? { activationTimestamp: activation.timestamp } : {}),
		...(activation?.epoch != null ? { activationEpoch: activation.epoch } : {}),
		...(links?.ethereumOrg != null ? { linkEthereumOrg: links.ethereumOrg } : {}),
		...(links?.executionSpecs != null ? { linkExecutionDocs: links.executionSpecs } : {}),
		...(links?.consensusSpecs != null ? { linkConsensusDocs: links.consensusSpecs } : {}),
		...(links?.forkcast != null ? { linkForkcast: links.forkcast } : {}),
		...(proposalIds != null && proposalIds.length > 0 ?
			{
				$$proposals: proposalIds.map((id) => ({
					[EntityMetaKey.Id]: {
						realm: ProposalRealm.Ethereum,
						category: id.kind,
						number: id.number,
					},
					category: null,
					body: null,
				})),
			}
		:	{}),
	} as Entity<typeof schema, EntityType.NetworkFork>
}
