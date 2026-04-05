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
		href,
		open = $bindable(true),
	}: {
		children?: Snippet
		entityId: EntityId<EntityType.Network>
		open?: boolean
		href: string
	} = $props()


	// (Derived)
	const networkRowQuery = useLiveQuery(
		(q) => (
			q
				.from({
					n: entityCollections[EntityType.Network],
				})
				.where(({ n }) =>
					and(
						entityCollectionRowIdEqualsEntityIdByFields(
							n.$id,
							entityId,
							['chainId'],
						),
						inArray(
							n[entityCollectionRow.source],
							sourcesForEntityBaseLiveQuery(EntityType.Network),
						),
					),
				)
				.select(({ n }) => n)
		),
		[() => entityId],
	)

	const row = $derived(
		mergeEntityCollectionRows(
			(networkRowQuery.data ?? []) as Record<string, unknown>[],
		) as Record<string, unknown> | undefined,
	)
	const chainId = $derived(
		typeof entityId?.chainId === 'number' ?
			entityId.chainId
		:	undefined,
	)


	// Components
	import Boundary from '$/components/Boundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	{entityId}
	{href}
	{open}
>
	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Network}
			{entityId}
		>
			<Boundary>
				{#snippet Failed(err, _retry)}
					<p role="alert">
						{String(err)}
					</p>
				{/snippet}

				{#if networkRowQuery.isLoading}
					<p data-text="muted">
						Loading…
					</p>
				{:else if row != null}
					<dl data-column>
						<dt>
							Name
						</dt>
						<dd>
							{String(row.name ?? '–')}
						</dd>
						<dt>
							Native
						</dt>
						<dd>
							{String(row.nativeSymbol ?? '–')}
						</dd>
						<dt>
							Explorer
						</dt>
						<dd>
							{#if typeof row.explorerOrigin === 'string' && row.explorerOrigin.length > 0}
								{row.explorerOrigin}
							{:else}
								–
							{/if}
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
										href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blocks', {
											networkId: String(chainId),
										})}
									>
										Blocks
									</a>
								</li>
								<li>
									<a
										href={resolve('/(explore)/(networks)/network/[networkId]/(network)/transactions', {
											networkId: String(chainId),
										})}
									>
										Recent transactions
									</a>
								</li>
								<li>
									<a
										href={resolve('/(explore)/(networks)/network/[networkId]/(network)/forks', {
											networkId: String(chainId),
										})}
									>
										Forks
									</a>
								</li>
							</ul>
						</nav>
					{/if}
				{:else}
					<p data-text="muted">
						Network not available for this chain id.
					</p>
				{/if}
			</Boundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
