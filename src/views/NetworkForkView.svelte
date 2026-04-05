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
			entityId: EntityId<EntityType.NetworkFork>
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
	const forkRowQuery = useLiveQuery(
		(q) => (
			q
				.from({
					f: entityCollections[EntityType.NetworkFork],
				})
				.where(({ f }) =>
					and(
						entityCollectionRowIdEqualsEntityIdByFields(
							f.$id,
							entityId,
							[
								'$network.chainId',
								'forkId',
							],
						),
						inArray(
							f[entityCollectionRow.source],
							sourcesForEntityBaseLiveQuery(EntityType.NetworkFork),
						),
					),
				)
				.select(({ f }) => f)
		),
		[() => entityId],
	)

	const row = $derived(
		mergeEntityCollectionRows(
			(forkRowQuery.data ?? []) as Record<string, unknown>[],
		) as Record<string, unknown> | undefined,
	)
	const chainId = $derived(
		typeof entityId?.$network?.chainId === 'number' ?
			entityId.$network.chainId
		:	undefined,
	)


	// Components
	import Boundary from '$/components/Boundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.NetworkFork}
	{entityId}
	title="Fork"
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.NetworkFork}
				{entityId}
			>
				<Boundary>
					{#snippet Failed(err, _retry)}
						<p role="alert">
							{String(err)}
						</p>
					{/snippet}

					{#if forkRowQuery.isLoading}
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
								Slug
							</dt>
							<dd>
								{String(row.slug ?? '–')}
							</dd>
							<dt>
								Activation block
							</dt>
							<dd>
								{typeof row.activationBlock === 'number' ?
									String(row.activationBlock)
								:	'–'}
							</dd>
							<dt>
								Execution layer
							</dt>
							<dd>
								{String(row.executionProtocol ?? '–')}
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
												'/(explore)/(networks)/network/[networkId]/(network)/(forks)/(fork)/fork/[forkSlug]/blocks',
												{
													networkId: String(chainId),
													forkSlug: entityId.forkId,
												},
											)}
										>
											Blocks (network head, this fork route)
										</a>
									</li>
									<li>
										<a
											href={resolve('/(explore)/(networks)/network/[networkId]', {
												networkId: String(chainId),
											})}
										>
											Network overview
										</a>
									</li>
									<li>
										<a
											href={resolve('/(explore)/(networks)/network/[networkId]/(network)/forks', {
												networkId: String(chainId),
											})}
										>
											All forks on this network
										</a>
									</li>
								</ul>
							</nav>
						{/if}
					{:else}
						<p data-text="muted">
							Fork not found.
						</p>
					{/if}
				</Boundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
