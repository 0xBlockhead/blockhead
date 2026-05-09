<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import Coin_TimestampSchema from '$/schema/Coin_Timestamp.ts'


	// Context
	import { resolve } from '$app/paths'


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
			entityId: typeof Coin_TimestampSchema.id.infer | string
			href?: string
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


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// (Derived)
	const coinTimestampIdKey = $derived(
		typeof entityId === 'string' ?
			entityId
		:	stringify(entityId),
	)

	const coinTimestampQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Coin_Timestamp] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						coinTimestampIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => coinTimestampIdKey],
	)

	const coinTimestampRow = $derived(
		coinTimestampQuery.data?.[0]?.row,
	)

	const wireId = $derived(
		typeof entityId === 'string' ?
			coinTimestampRow?.[EntityMetaKey.Id]
		:
			entityId,
	)

	const coinTimestampField = $derived(
		(() => {
			const bag = coinTimestampRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
			return {
				marketCap: typeof b.marketCap === 'bigint' ? b.marketCap : undefined,
				totalSupply: typeof b.totalSupply === 'bigint' ? b.totalSupply : undefined,
			}
		})(),
	)

	const timestampMs = $derived(
		wireId === undefined ?
			undefined
		:	Number(wireId.timestampNs / 1_000_000n),
	)


	// Components
	import CoinView from '$/views/CoinView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
</script>


{#if wireId === undefined}
	<span data-placeholder>
		…
	</span>
{:else}
	<EntityView
		entityType={EntityType.Coin_Timestamp}
		entityId={wireId}
		href={href}
		{open}
		{...entityViewRest}
		title={`${wireId.$coin.coinId} snapshot`}
	>
		{#snippet Content()}
			<dl>
				{#if coinTimestampField?.marketCap !== undefined}
					<div>
						<dt>Market cap</dt>
						<dd>{String(coinTimestampField.marketCap)}</dd>
					</div>
				{/if}

				{#if timestampMs !== undefined && Number.isFinite(timestampMs)}
					<div>
						<dt>As of</dt>
						<dd>
							<Timestamp
								timestamp={timestampMs}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
				{/if}
			</dl>
		{/snippet}

		{#snippet Details({
			open: _open,
		})}
			<EntityDetails
				entityType={EntityType.Coin_Timestamp}
				entityId={wireId}
			>
				<QueryBoundary
					placeholderText="Loading coin snapshot…"
					query={coinTimestampQuery}
				>
					{#snippet children(_rows)}
						<dl>
							{#if coinTimestampField?.totalSupply !== undefined}
								<div>
									<dt>Total supply</dt>
									<dd>{String(coinTimestampField.totalSupply)}</dd>
								</div>
							{/if}

							<div>
								<dt>Timestamp (ns)</dt>
								<dd>{String(wireId.timestampNs)}</dd>
							</div>
						</dl>
					{/snippet}
				</QueryBoundary>
			</EntityDetails>

			<section>
				<h2>
					Coin
				</h2>
				<CoinView
					entityId={wireId.$coin}
					href={resolve(
						'/(assets)/(coins)/coin/[coinId]',
						{
							coinId: wireId.$coin.coinId,
						},
					)}
					id={`${coinTimestampIdKey}:coin`}
					open={false}
				/>
			</section>

			{#if children}
				{@render children()}
			{/if}
		{/snippet}
	</EntityView>
{/if}
