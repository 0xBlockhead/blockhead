// Types/constants
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { ForkScheduleKind } from '$/schema/NetworkFork.ts'
import { ethereumExecutionForks as ethereumExecutionForks1 } from '$/constants/Forks/Chain1.ts'
import { ethereumExecutionForks as ethereumExecutionForks10 } from '$/constants/Forks/Chain10.ts'
import { ethereumExecutionForks as ethereumExecutionForks8453 } from '$/constants/Forks/Chain8453.ts'
import { ethereumExecutionForks as ethereumExecutionForks17000 } from '$/constants/Forks/Chain17000.ts'
import { ethereumExecutionForks as ethereumExecutionForks84532 } from '$/constants/Forks/Chain84532.ts'
import { ethereumExecutionForks as ethereumExecutionForks11155111 } from '$/constants/Forks/Chain11155111.ts'
import { ethereumExecutionForks as ethereumExecutionForks11155420 } from '$/constants/Forks/Chain11155420.ts'


// Constants
export const ethereumExecutionForks = [
	...ethereumExecutionForks1,
	...ethereumExecutionForks10,
	...ethereumExecutionForks8453,
	...ethereumExecutionForks17000,
	...ethereumExecutionForks84532,
	...ethereumExecutionForks11155111,
	...ethereumExecutionForks11155420,
] as const satisfies readonly Entity<typeof schema, EntityType.NetworkFork>[]


// Functions
export const networkHasCatalogedBlobScheduleFork = (chainId: number): boolean => (
	ethereumExecutionForks.some((row) => {
		const id = row[EntityMetaKey.Id]
		if (!('$network' in id) || id.$network.chainId !== chainId) return false
		return row.kind === ForkScheduleKind.Blob
	})
)

export const networkForkIdFromChainIdAndUrlSegment = (
	chainId: number,
	segment: string,
): string | undefined => (
	ethereumExecutionForks.find((row) => {
		const id = row[EntityMetaKey.Id]
		if (id.$network.chainId !== chainId) return false
		const slugRaw = row.slug
		const slug = typeof slugRaw === 'string' && slugRaw.length ?
			slugRaw
		:	id.forkId.toLowerCase().replace(/\s+/g, '-')
		const { forkId } = id
		return (
			segment === forkId
			|| segment === slug
			|| segment.toLowerCase() === forkId.toLowerCase()
			|| segment.toLowerCase() === slug.toLowerCase()
		)
	})?.[EntityMetaKey.Id].forkId
)


// Lookups
export const ethereumExecutionForkByChainIdAndForkId = Object.fromEntries(
	ethereumExecutionForks
		.map((row) => [
			`${row[EntityMetaKey.Id].$network.chainId}:${row[EntityMetaKey.Id].forkId}`,
			row,
		])
)
