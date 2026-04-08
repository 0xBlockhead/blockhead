<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/collections/$collections.ts'


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
			entityId: EntityId<typeof schema, EntityType.Coin>
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


	const coinIdKey = $derived(
		stringify(entityId),
	)

	const coinQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Coin] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						coinIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => coinIdKey],
	)

	const coinRow = $derived(
		coinQuery.data?.[0]?.row,
	)

	const coinField = $derived(
		(() => {
			const bag = coinRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				symbol: typeof b.symbol === 'string' && b.symbol.length ? b.symbol : undefined,
				name: typeof b.name === 'string' && b.name.length ? b.name : undefined,
				decimals: typeof b.decimals === 'number' ? b.decimals : undefined,
			}
		})(),
	)

	const displayTitle = $derived(
		coinField?.symbol ?? coinField?.name ?? entityId.coinId,
	)

	const coinHref = $derived(
		resolve('/(assets)/(coins)/coin/[coinId]', {
			coinId: entityId.coinId,
		}),
	)

	const coinInstancesFieldQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					link: entityFieldCollections[EntityType.Coin]['$$coinInstances'],
				})
				.where(({ link }) => (
					eq(
						link[EntityMetaKey.ParentIdKey],
						coinIdKey,
					)
				))
				.select(({ link }) => ({
					instance: link[EntityMetaKey.Value],
				}))
		),
		[() => coinIdKey],
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import CoinPriceView from '$/views/CoinPriceView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Coin id</dt>
				<dd>{entityId.coinId}</dd>
			</div>
			{#if coinField?.symbol != null}
				<div>
					<dt>Symbol</dt>
					<dd>{coinField.symbol}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Coin}
			{entityId}
		>
			<QueryBoundary
				query={coinQuery}
			>

				{#snippet children(coinRows)}
					{#if coinRows?.[0]?.row == null}
						<p data-text="muted">
							No coin row in collections yet (no resolver for this coin id).
						</p>
					{:else}
						<dl>
							{#if coinField?.name != null}
								<div>
									<dt>Name</dt>
									<dd>{coinField.name}</dd>
								</div>
							{/if}
							{#if coinField?.decimals != null}
								<div>
									<dt>Decimals</dt>
									<dd>{String(coinField.decimals)}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<section>
			<h2>
				Price
			</h2>
			<CoinPriceView
				entityId={{
					$coin: {
						coinId: entityId.coinId,
					},
				}}
				href={coinHref}
				id={`${coinIdKey}:price`}
				layout={EntityLayout.Summary}
				open={false}
			/>
		</section>

		<section>
			<h2>
				Instances
			</h2>
			<QueryBoundary
				query={coinInstancesFieldQuery}
			>
				{#snippet children(instanceRows)}
					{@const uniqueInstanceRows = [
						...(
							(instanceRows ?? [])
								.reduce(
									(rowsByKey, instanceRow) => (
										rowsByKey.set(
											instanceRow.instance[EntityMetaKey.IdKey] ?? '',
											instanceRow,
										)
									),
									new Map(),
								)
								.values()
						),
					]}
					{#if uniqueInstanceRows.length === 0}
						<p data-text="muted">
							No chain instances in collections yet.
						</p>
					{:else}
						<ul>
							{#each uniqueInstanceRows as instanceRow (instanceRow.instance[EntityMetaKey.IdKey])}
								<li>
									<CoinInstanceView
										entityId={instanceRow.instance[EntityMetaKey.Id]}
										href={coinHref}
										id={`${coinIdKey}:instance:${instanceRow.instance[EntityMetaKey.IdKey]}`}
										layout={EntityLayout.Summary}
										open={false}
									/>
								</li>
							{/each}
						</ul>
					{/if}
				{/snippet}
			</QueryBoundary>
		</section>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
