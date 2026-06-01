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


	// State
	let {
		entityId,
		href = resolve(
			'/(assets)/(coins)/coin/[coinId]/timestamp/[timestampMs]',
			{
				coinId: entityId.$coin.coinId,
				timestampMs: String(entityId.timestampMs),
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Coin_Timestamp>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'href'
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Functions
	const resolvedHref = (
		href
		?? resolve(
			'/(assets)/(coins)/coin/[coinId]',
			{
				coinId: entityId.$coin.coinId,
			},
		)
	)


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const coinTimestamp = useEntity(
		EntityType.Coin_Timestamp,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Local_Internal,
			],
			marketCap: {},
			change24hPercent: {},
			...(open ?
				{
					totalSupply: {},
					transport: {},
					providerAssetId: {},
				}
				:
				{}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.Coin_Timestamp}
	bind:open
	{entityId}
	href={href}
	title={`Coin snapshot ${entityId.$coin.coinId}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={coinTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(coinTimestamp)}
				{#if coinTimestamp.marketCap !== undefined}
					<CurrencyAmount
						currency="USD"
						value={coinTimestamp.marketCap}
					/>
				{:else if coinTimestamp.change24hPercent != null && Number.isFinite(coinTimestamp.change24hPercent)}
					<NumberValue
						value={coinTimestamp.change24hPercent}
						options={{ maximumFractionDigits: 2, signDisplay: 'exceptZero' }}
					/>%
				{:else}
					<span>
						{entityId.$coin.coinId}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			<strong>Timestamped</strong>
			catalog snapshot for the owning coin: fundamental fields frozen at wall-clock <strong>quote time</strong>
			— the entity id keeps <strong>epoch milliseconds</strong>
			for stable ordering; pair with spot or OHLC market rows when auditing supply or market-cap moves, not with mempool calldata.
		</p>
	{/snippet}

	{#snippet Content({})}
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
					{#if coinTimestamp.change24hPercent != null && Number.isFinite(coinTimestamp.change24hPercent)}
						<div>
							<dt>24h change</dt>
							<dd>
								<NumberValue
									value={coinTimestamp.change24hPercent}
									options={{ maximumFractionDigits: 2, signDisplay: 'exceptZero' }}
								/>%
							</dd>
						</div>
					{/if}
					<div>
						<dt>Snapshot wall time</dt>
						<dd>
							<Timestamp
								timestamp={entityId.timestampMs}
							/>
						</dd>
					</div>
					<div>
						<dt>Coin</dt>
						<dd>
							<CoinView
								entityId={entityId.$coin}
								layout={EntityLayout.Title}
								open={false}
							/>
						</dd>
					</div>
					{#if (
						open
						&& coinTimestamp.totalSupply !== undefined
					)}
						<div>
							<dt>Recorded total supply</dt>
							<dd>{String(coinTimestamp.totalSupply)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& coinTimestamp.transport !== undefined
					)}
						<div>
							<dt>Transport</dt>
							<dd><code>{coinTimestamp.transport}</code></dd>
						</div>
					{/if}
					{#if (
						open
						&& coinTimestamp.providerAssetId !== undefined
					)}
						<div>
							<dt>Provider asset id</dt>
							<dd><code>{coinTimestamp.providerAssetId}</code></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
	{/snippet}
</EntityView>
