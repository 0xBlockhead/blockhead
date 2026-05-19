<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


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
			entityId: EntityId<typeof schema, EntityType.Coin_Timestamp>
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
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const coinTimestamp = useEntity(
		EntityType.Coin_Timestamp,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			marketCap: {},
			...(open ?
				{
					totalSupply: {},
				}
				:
				{}),
		},
	)


	const resolvedHref = (
		href
		?? resolve(
			'/(assets)/(coins)/coin/[coinId]',
			{
				coinId: entityId.$coin.coinId,
			},
		)
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
</script>


<EntityView
	entityType={EntityType.Coin_Timestamp}
	bind:open
	{entityId}
	href={resolvedHref}
	title={`${entityId.$coin.coinId} · local snapshot`}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.$coin.coinId}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			<strong>Timestamped</strong>
			catalog snapshot for the owning coin: fundamental fields frozen at wall-clock <strong>quote time</strong>
			— the entity id keeps <strong>epoch milliseconds</strong>
			for stable ordering; pair with spot or OHLC market rows when auditing supply or market-cap moves, not with mempool calldata.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={coinTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(coinTimestamp)}
				<dl data-column-item="center">
					{#if coinTimestamp.marketCap !== undefined}
						<div>
							<dt>Market cap</dt>
							<dd>
								<CurrencyAmount
									currency="USD"
									value={coinTimestamp.marketCap}
								/>
							</dd>
						</div>
					{/if}
					<div>
						<dt>Snapshot wall time</dt>
						<dd>
							<Timestamp
								timestamp={entityId.timestampMs}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
					<div>
						<dt>Coin</dt>
						<dd>
							<CoinView
								entityId={entityId.$coin}
								href={resolve(
									'/(assets)/(coins)/coin/[coinId]',
									{ coinId: entityId.$coin.coinId },
								)}
								layout={EntityLayout.Id}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
					{#if open}
						{#if coinTimestamp.totalSupply !== undefined}
							<div>
								<dt>Recorded total supply</dt>
								<dd>{String(coinTimestamp.totalSupply)}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Coin_Timestamp}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
