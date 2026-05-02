<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


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
			entityId: EntityId<typeof schema, EntityType.NetworkFork>
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


	const forkIdKey = $derived(
		stringify(entityId),
	)

	const chainId = $derived(
		typeof entityId?.$network?.chainId === 'number' ?
			entityId.$network.chainId
		:	undefined,
	)

	const forkQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ forkRow: entityCollectionByEntityType[EntityType.NetworkFork] })
				.where(({ forkRow }) => (
					eq(
						forkRow[EntityMetaKey.IdKey],
						forkIdKey,
					)
				))
				.select(({ forkRow }) => ({ forkRow }))
		),
		[() => forkIdKey],
	)

	const forkRow = $derived(
		(
			forkQuery.data?.find(
				(row) => row.forkRow[EntityMetaKey.Source] === Source.Constants_Internal,
			)?.forkRow
			?? forkQuery.data?.[0]?.forkRow
		)
	)

	const forkField = $derived(
		(() => {
			const bag = forkRow?.[EntityMetaKey.Fields]
			if (bag === undefined || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				name: typeof b.name === 'string' && b.name.length ? b.name : undefined,
				slug: typeof b.slug === 'string' && b.slug.length ? b.slug : undefined,
				activationBlock: typeof b.activationBlock === 'number' ? b.activationBlock : undefined,
				activationEpoch: typeof b.activationEpoch === 'number' ? b.activationEpoch : undefined,
				kind: typeof b.kind === 'string' && b.kind.length ? b.kind : undefined,
			}
		})(),
	)

	const forkUrlSlug = $derived(
		forkField?.slug ?? entityId.forkId,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
</script>


<EntityView
	{...entityViewRest}
	entityType={EntityType.NetworkFork}
	{entityId}
	{href}
	{open}
	title={forkField?.name ?? entityId.forkId}
>
	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.NetworkFork}
			{entityId}
		>
			<QueryBoundary
				query={forkQuery}
			>

				{#snippet children(rows)}
				{@const forkRow = (
					rows?.find(
						(row) => row.forkRow[EntityMetaKey.Source] === Source.Constants_Internal,
					)?.forkRow
					?? rows?.[0]?.forkRow
				)}
				{#if forkRow === undefined}
					<p data-text="muted">
						No fork data for this network yet.
					</p>
				{:else}
					<dl>
						<div>
							<dt>Fork id</dt>
							<dd>{entityId.forkId}</dd>
						</div>
						{#if forkField?.slug !== undefined}
							<div>
								<dt>Slug</dt>
								<dd>{forkField.slug}</dd>
							</div>
						{/if}
						{#if forkField?.activationBlock !== undefined}
							<div>
								<dt>Activation block</dt>
								<dd>{String(forkField.activationBlock)}</dd>
							</div>
						{/if}
						{#if forkField?.activationEpoch !== undefined}
							<div>
								<dt>Activation epoch</dt>
								<dd>{String(forkField.activationEpoch)}</dd>
							</div>
						{/if}
						{#if forkField?.kind !== undefined}
							<div>
								<dt>Kind</dt>
								<dd>{forkField.kind}</dd>
							</div>
						{/if}
					</dl>
				{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if chainId !== undefined}
			<div
				data-scroll-container="inline layout-carousel carousel-marker-tabs"
				style="--carousel-basis: 40ch; gap: 0.5em"
			>
				<section>
					<EvmBlocksView
						entityFieldReference={{
							entityType: EntityType.Network,
							entityId: { chainId },
							fieldName: '$$evmBlocks',
						}}
						href={resolve(
							'/(explore)/(networks)/network/[networkId]/(network)/(forks)/fork/[forkSlug]/(fork)/blocks',
							{
								networkId: String(chainId),
								forkSlug: forkUrlSlug,
							},
						)}
						id={`${forkIdKey}:blocks`}
					/>
				</section>
				<section>
					<EvmTransactionsView
						entityFieldReference={{
							entityType: EntityType.Network,
							entityId: { chainId },
							fieldName: '$$evmTransactions',
						}}
						href={resolve(
							'/(explore)/(networks)/network/[networkId]/(network)/transactions',
							{
								networkId: String(chainId),
							},
						)}
						id={`${forkIdKey}:transactions`}
					/>
				</section>
			</div>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
