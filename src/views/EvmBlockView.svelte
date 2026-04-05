<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { entityCollections } from '$/data/collections/entityCollections.ts'
	import { mergeEntityCollectionRows } from '$/data/tanstackDb/mergeEntityCollectionRows.ts'
	import { sourcesForEntityBaseLiveQuery } from '$/data/tanstackDb/entityQuerySources.ts'
	import { entityCollectionRowIdEqualsEntityIdByFields } from '$/data/tanstackDb/entityCollectionRowWhere.ts'
	import { entityCollectionRow } from '$/schema/$EntityCollectionRow.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { and, inArray, useLiveQuery } from '@tanstack/svelte-db'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<EntityType.EvmBlock>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// (Derived)
	const blockRowQuery = useLiveQuery(
		(q) => (
			q
				.from({
					b: entityCollections[EntityType.EvmBlock],
				})
				.where(({ b }) =>
					and(
						entityCollectionRowIdEqualsEntityIdByFields(
							b.$id,
							entityId,
							[
								'$network.chainId',
								'blockNumber',
							],
						),
						inArray(
							b[entityCollectionRow.source],
							sourcesForEntityBaseLiveQuery(EntityType.EvmBlock),
						),
					),
				)
				.select(({ b }) => b)
		),
		[() => entityId],
	)

	const row = $derived(
		mergeEntityCollectionRows(
			(blockRowQuery.data ?? []) as Record<string, unknown>[],
		) as Record<string, unknown> | undefined,
	)
	const chainId = $derived(
		typeof entityId?.$network?.chainId === 'number' ?
			entityId.$network.chainId
		:	undefined,
	)
	const blockHash = $derived((row?.$id as { hash?: string } | undefined)?.hash ?? entityId.hash)


	// Components
	import Boundary from '$/components/Boundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlock}
	{entityId}
	title="Block"
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.EvmBlock}
				{entityId}
			>
				<Boundary>
					{#snippet Failed(err, _retry)}
						<p role="alert">
							{String(err)}
						</p>
					{/snippet}

					{#if blockRowQuery.isLoading}
						<p data-text="muted">
							Loading…
						</p>
					{:else if row != null}
						<dl data-column>
							<dt>
								Number
							</dt>
							<dd>
								{String(row.number ?? '–')}
							</dd>
							<dt>
								Hash
							</dt>
							<dd>
								{#if typeof blockHash === 'string'}
									<TruncatedValue
										value={blockHash}
										format={TruncatedValueFormat.Abbr}
									/>
								{:else}
									–
								{/if}
							</dd>
							<dt>
								Timestamp
							</dt>
							<dd>
								{typeof row.timestamp === 'number' ?
									new Date(row.timestamp * 1000).toISOString()
								:	'–'}
							</dd>
							<dt>
								Transactions
							</dt>
							<dd>
								{typeof row.transactionCount === 'number' ?
									String(row.transactionCount)
								:	'–'}
							</dd>
						</dl>

						{#if chainId != null}
							<nav data-column>
								<p data-heading>
									In this explorer
								</p>
								<ul data-list>
									<li>
										<a
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]/(block)/transactions',
												{
													networkId: String(chainId),
													blockNumber: String(row.number ?? entityId.blockNumber),
												},
											)}
										>
											Transactions in this block
										</a>
									</li>
									<li>
										<a
											href={resolve('/(explore)/(networks)/network/[networkId]/(network)/transactions', {
												networkId: String(chainId),
											})}
										>
											Recent transactions on this network
										</a>
									</li>
								</ul>
							</nav>
						{/if}
					{:else}
						<p data-text="muted">
							Block not found via RPC.
						</p>
					{/if}
				</Boundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
