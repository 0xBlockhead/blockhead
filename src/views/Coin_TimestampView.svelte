<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(assets)/(coins)/coin/[coinId]', {
			coinId: selection.entitySelector.$coin.coinId,
		}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Coin_Timestamp>
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


	const coinTimestamp = $derived(selection(
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
	entitySelector={selection.entitySelector}
	href={href}
	title={`Coin snapshot ${selection.entitySelector.$coin.coinId}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={coinTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(coinTimestamp)}
				{#if coinTimestamp.marketCapUsd !== undefined || coinTimestamp.marketCap !== undefined}
					<CurrencyAmount
						currency="USD"
						value={coinTimestamp.marketCapUsd ?? coinTimestamp.marketCap ?? 0}
					/>
				{:else if coinTimestamp.change24hPercent != null && Number.isFinite(coinTimestamp.change24hPercent)}
					<NumberValue
						value={coinTimestamp.change24hPercent}
						options={{ maximumFractionDigits: 2, signDisplay: 'exceptZero' }}
					/>%
				{:else}
					<span>
						{selection.entitySelector.$coin.coinId}
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
				{#if coinTimestamp.marketCapUsd !== undefined || coinTimestamp.marketCap !== undefined}
					<CurrencyAmount
						currency="USD"
						value={coinTimestamp.marketCapUsd ?? coinTimestamp.marketCap ?? 0}
					/>
				{:else if coinTimestamp.change24hPercent != null && Number.isFinite(coinTimestamp.change24hPercent)}
					<NumberValue
						value={coinTimestamp.change24hPercent}
						options={{ maximumFractionDigits: 2, signDisplay: 'exceptZero' }}
					/>%
				{:else}
					<span>
						{selection.entitySelector.$coin.coinId}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			<strong>Timestamped</strong>
			catalog snapshot for the owning coin: fundamental fields frozen at wall-clock <strong>quote time</strong>
			— the entity selection.entitySelector keeps <strong>epoch milliseconds</strong>
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
					{#if coinTimestamp.marketCapRank != null && Number.isFinite(coinTimestamp.marketCapRank)}
						<div>
							<dt>Market cap rank</dt>
							<dd>
								{String(coinTimestamp.marketCapRank)}
							</dd>
						</div>
					{/if}
					{#if coinTimestamp.marketCapUsd !== undefined || coinTimestamp.marketCap !== undefined}
						<div>
							<dt>Market cap</dt>
							<dd>
								<CurrencyAmount
									currency="USD"
									value={coinTimestamp.marketCapUsd ?? coinTimestamp.marketCap ?? 0}
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
								timestamp={selection.entitySelector.timestampMs}
							/>
						</dd>
					</div>
					<div>
						<dt>Coin</dt>
						<dd>
							<CoinView
								selection={select(EntityType.Coin, selection.entitySelector.$coin)}
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
</EntityView>
