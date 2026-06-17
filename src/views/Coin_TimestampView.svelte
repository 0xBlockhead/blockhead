<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(assets)/(coins)/coin/[coinId]', {
			coinId: selector.$coin.coinId,
		}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Coin_Timestamp>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const coinTimestamp = $derived(proxy(EntityType.Coin_Timestamp,
		selector,
		{
			sources: [
				Source.Coingecko_Rest,
				Source.Blockscout_Rest,
				Source.Local_Internal,
			],
			fields: {
				marketCapRank: true,
				marketCapUsd: true,
				marketCap: true,
				change24hPercent: true,
				...(open && {
					totalSupply: true,
					transport: true,
					providerAssetId: true,
				}),
			},
		},
	))


	// Components
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
	entitySelector={selector}
	href={href}
	title={`Coin snapshot ${selector.$coin.coinId}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={coinTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(coinTimestamp)}
				{#if coinTimestamp.fields.marketCapUsd !== undefined || coinTimestamp.fields.marketCap !== undefined}
					<CurrencyAmount
						currency="USD"
						value={coinTimestamp.fields.marketCapUsd ?? coinTimestamp.fields.marketCap ?? 0}
					/>
				{:else if coinTimestamp.fields.change24hPercent != null && Number.isFinite(coinTimestamp.fields.change24hPercent)}
					<NumberValue
						value={coinTimestamp.fields.change24hPercent}
						options={{ maximumFractionDigits: 2, signDisplay: 'exceptZero' }}
					/>%
				{:else}
					<span>
						{selector.$coin.coinId}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={coinTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(coinTimestamp)}
				{#if coinTimestamp.fields.marketCapUsd !== undefined || coinTimestamp.fields.marketCap !== undefined}
					<CurrencyAmount
						currency="USD"
						value={coinTimestamp.fields.marketCapUsd ?? coinTimestamp.fields.marketCap ?? 0}
					/>
				{:else if coinTimestamp.fields.change24hPercent != null && Number.isFinite(coinTimestamp.fields.change24hPercent)}
					<NumberValue
						value={coinTimestamp.fields.change24hPercent}
						options={{ maximumFractionDigits: 2, signDisplay: 'exceptZero' }}
					/>%
				{:else}
					<span>
						{selector.$coin.coinId}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			<strong>Timestamped</strong>
			catalog snapshot for the owning coin: fundamental fields frozen at wall-clock <strong>quote time</strong>
			— the entity selector keeps <strong>epoch milliseconds</strong>
			for stable ordering; pair with spot or OHLC market coinTimestamps when auditing supply or market-cap moves, not with mempool calldata.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={coinTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(coinTimestamp)}
				<dl data-column-item="center">
					{#if coinTimestamp.fields.marketCapRank != null && Number.isFinite(coinTimestamp.fields.marketCapRank)}
						<div>
							<dt>Market cap rank</dt>
							<dd>
								{String(coinTimestamp.fields.marketCapRank)}
							</dd>
						</div>
					{/if}
					{#if coinTimestamp.fields.marketCapUsd !== undefined || coinTimestamp.fields.marketCap !== undefined}
						<div>
							<dt>Market cap</dt>
							<dd>
								<CurrencyAmount
									currency="USD"
									value={coinTimestamp.fields.marketCapUsd ?? coinTimestamp.fields.marketCap ?? 0}
								/>
							</dd>
						</div>
					{/if}
					{#if coinTimestamp.fields.change24hPercent != null && Number.isFinite(coinTimestamp.fields.change24hPercent)}
						<div>
							<dt>24h change</dt>
							<dd>
								<NumberValue
									value={coinTimestamp.fields.change24hPercent}
									options={{ maximumFractionDigits: 2, signDisplay: 'exceptZero' }}
								/>%
							</dd>
						</div>
					{/if}
					<div>
						<dt>Snapshot wall time</dt>
						<dd>
							<Timestamp
								timestamp={selector.timestampMs}
							/>
						</dd>
					</div>
					<div>
						<dt>Coin</dt>
						<dd>
							<CoinView
								selector={selector.$coin}
								layout={EntityLayout.Title}

								open={false}
								/>
						</dd>
					</div>
					{#if (
						open
						&& coinTimestamp.fields.totalSupply !== undefined
					)}
						<div>
							<dt>Recorded total supply</dt>
							<dd>{String(coinTimestamp.fields.totalSupply)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& coinTimestamp.fields.transport !== undefined
					)}
						<div>
							<dt>Transport</dt>
							<dd><code>{coinTimestamp.fields.transport}</code></dd>
						</div>
					{/if}
					{#if (
						open
						&& coinTimestamp.fields.providerAssetId !== undefined
					)}
						<div>
							<dt>Provider asset id</dt>
							<dd><code>{coinTimestamp.fields.providerAssetId}</code></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
