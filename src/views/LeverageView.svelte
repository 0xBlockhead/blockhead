<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


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
			entityId: EntityId<typeof schema, EntityType.Leverage>
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
			| 'Summary'
		>
	> = $props()


	const leverageIdKey = $derived(
		stringify(entityId),
	)

	const chainId = $derived(
		typeof entityId?.$network?.chainId === 'number' ?
			entityId.$network.chainId
		:	undefined,
	)

	const leverageQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Leverage] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						leverageIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => leverageIdKey],
	)

	const leverageRow = $derived(
		leverageQuery.data?.[0]?.row,
	)

	const leverageField = $derived(
		(() => {
			const bag = leverageRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				tickLower: typeof b.tickLower === 'number' ? b.tickLower : undefined,
				tickUpper: typeof b.tickUpper === 'number' ? b.tickUpper : undefined,
				liquidity: typeof b.liquidity === 'bigint' ? b.liquidity : undefined,
				token0Owed: typeof b.token0Owed === 'bigint' ? b.token0Owed : undefined,
				token1Owed: typeof b.token1Owed === 'bigint' ? b.token1Owed : undefined,
				tokenId: typeof b.tokenId === 'bigint' ? b.tokenId : undefined,
				origin: typeof b.origin === 'string' && b.origin.length ? b.origin : undefined,
				createdAtTimestamp: typeof b.createdAtTimestamp === 'number' ? b.createdAtTimestamp : undefined,
			}
		})(),
	)

	const displayTitle = $derived(
		entityId.id,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.Leverage}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			{#if chainId != null}
				<div>
					<dt>Chain ID</dt>
					<dd>{String(chainId)}</dd>
				</div>
			{/if}
			<div>
				<dt>Leverage id</dt>
				<dd>
					<TruncatedValue
						value={entityId.id}
						format={TruncatedValueFormat.Visual}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.Leverage}
				{entityId}
			>
				<QueryBoundary
					query={leverageQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No leverage row in collections yet (no resolver row for this id).
						</p>
					{:else}
						<dl>
							{#if leverageField?.tickLower != null}
								<div>
									<dt>Tick lower</dt>
									<dd>{String(leverageField.tickLower)}</dd>
								</div>
							{/if}
							{#if leverageField?.tickUpper != null}
								<div>
									<dt>Tick upper</dt>
									<dd>{String(leverageField.tickUpper)}</dd>
								</div>
							{/if}
							{#if leverageField?.liquidity != null}
								<div>
									<dt>Liquidity</dt>
									<dd>{String(leverageField.liquidity)}</dd>
								</div>
							{/if}
							{#if leverageField?.token0Owed != null}
								<div>
									<dt>Token0 owed</dt>
									<dd>{String(leverageField.token0Owed)}</dd>
								</div>
							{/if}
							{#if leverageField?.token1Owed != null}
								<div>
									<dt>Token1 owed</dt>
									<dd>{String(leverageField.token1Owed)}</dd>
								</div>
							{/if}
							{#if leverageField?.tokenId != null}
								<div>
									<dt>Token id</dt>
									<dd>{String(leverageField.tokenId)}</dd>
								</div>
							{/if}
							{#if leverageField?.origin != null}
								<div>
									<dt>Origin</dt>
									<dd>{leverageField.origin}</dd>
								</div>
							{/if}
							{#if leverageField?.createdAtTimestamp != null}
								<div>
									<dt>Created at (timestamp)</dt>
									<dd>{String(leverageField.createdAtTimestamp)}</dd>
								</div>
							{/if}
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
