<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'


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
		title = 'Transaction',
		href,
		open = $bindable(true),
	}: {
		children?: Snippet
		entityId: EntityId<EntityType.EvmTransaction>
		title?: string
		href: string
		open?: boolean
	} = $props()


	// (Derived)
	const txRowQuery = useLiveQuery(
		(q) => (
			q
				.from({
					t: entityCollections[EntityType.EvmTransaction],
				})
				.where(({ t }) =>
					and(
						entityCollectionRowIdEqualsEntityIdByFields(
							t.$id,
							entityId,
							[
								'$network.chainId',
								'txHash',
							],
						),
						inArray(
							t[entityCollectionRow.source],
							sourcesForEntityBaseLiveQuery(EntityType.EvmTransaction),
						),
					),
				)
				.select(({ t }) => t)
		),
		[() => entityId],
	)

	const row = $derived(
		mergeEntityCollectionRows(
			(txRowQuery.data ?? []) as Record<string, unknown>[],
		) as Record<string, unknown> | undefined,
	)
	const chainId = $derived(
		typeof entityId?.$network?.chainId === 'number' ?
			entityId.$network.chainId
		:	undefined,
	)

	const fromActor = $derived((row?.$from as { $id?: { address?: string } } | undefined)?.$id?.address)
	const toActor = $derived((row?.$to as { $id?: { address?: string } } | undefined)?.$id?.address)
	const blockLinkNumber = $derived((row?.$block as { $id?: { blockNumber?: bigint } } | undefined)?.$id?.blockNumber)


	// Components
	import Boundary from '$/components/Boundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTransaction}
	{entityId}
	{title}
	{href}
	{open}
>
	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.EvmTransaction}
				{entityId}
			>
				<Boundary>
					{#snippet Failed(err, _retry)}
						<p role="alert">
							{String(err)}
						</p>
					{/snippet}

					{#if txRowQuery.isLoading}
						<p data-text="muted">
							Loading…
						</p>
					{:else if row != null}
						<dl data-column>
							<dt>
								Hash
							</dt>
							<dd>
								<TruncatedValue
									value={entityId.txHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
							<dt>
								From
							</dt>
							<dd>
								{#if typeof fromActor === 'string'}
									<TruncatedValue
										value={fromActor}
										format={TruncatedValueFormat.Abbr}
									/>
								{:else}
									–
								{/if}
							</dd>
							<dt>
								To
							</dt>
							<dd>
								{#if typeof toActor === 'string'}
									<TruncatedValue
										value={toActor}
										format={TruncatedValueFormat.Abbr}
									/>
								{:else}
									–
								{/if}
							</dd>
							<dt>
								Value (wei)
							</dt>
							<dd>
								{String(row.value ?? '–')}
							</dd>
							<dt>
								Status
							</dt>
							<dd>
								{typeof row.status === 'number' ?
									(row.status === 1 ? 'Success' : 'Reverted')
								:	'–'}
							</dd>
						</dl>

						{#if chainId != null}
							<nav data-column>
								<p data-heading>
									In this explorer
								</p>
								<ul data-list>
									{#if blockLinkNumber != null}
										<li>
											<a
												href={resolve(
													'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
													{
														networkId: String(chainId),
														blockNumber: String(blockLinkNumber),
													},
												)}
											>
												Block
												{String(blockLinkNumber)}
											</a>
										</li>
									{/if}
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
							Transaction not found via RPC.
						</p>
					{/if}
				</Boundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
