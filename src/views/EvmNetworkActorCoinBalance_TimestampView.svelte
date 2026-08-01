<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmNetworkActorCoinBalance_Timestamp> = $props()

	const evmNetworkActorCoinBalanceTimestamp = $derived(selection({
		fields: {
			balance: true,
			$actorCoin: {
				fields: {
					decimals: true,
					symbol: true,
				},
			},
			usdValue: true,
			blockNumber: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkActorCoinBalance_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.source || 'EVM network actor coin balance timestamp')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkActorCoinBalanceTimestamp}>
			{#snippet children(entity)}
				{@const balance = entity.balance}
				{#if balance != null}
					<NumberValue
						value={balance}
						decimalPlaces={selection.entitySelector.$actorCoin.decimals}
					/>

					<span>{selection.entitySelector.$actorCoin.symbol == null ? '' : ` ${selection.entitySelector.$actorCoin.symbol}`}</span>
				{/if}
				{@const usdValue = entity.usdValue}
				{#if usdValue != null}
					{usdValue}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmNetworkActorCoinBalanceTimestamp}>
			{#snippet children(entity)}
				{@const blockNumber = entity.blockNumber}
				{#if blockNumber != null}
					<span data-text="muted">
						{blockNumber}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={evmNetworkActorCoinBalanceTimestamp}
			>
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								{blockNumber}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={evmNetworkActorCoinBalanceTimestamp}
			>
				{#snippet children(entity)}
					{@const balance = entity.balance}
					{#if balance != null}
						<div>
							<dt>Balance</dt>
							<dd>
								<NumberValue
									value={balance}
									decimalPlaces={selection.entitySelector.$actorCoin.decimals}
								/>

								<span>{selection.entitySelector.$actorCoin.symbol == null ? '' : ` ${selection.entitySelector.$actorCoin.symbol}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={evmNetworkActorCoinBalanceTimestamp}
			>
				{#snippet children(entity)}
					{@const usdValue = entity.usdValue}
					{#if usdValue != null}
						<div>
							<dt>USD value</dt>
							<dd>
								{usdValue}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							priceUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const priceUsd = entity.priceUsd}
					{#if priceUsd != null}
						<div>
							<dt>Price USD</dt>
							<dd>
								{priceUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Actor coin</dt>
				<dd>
					<EvmNetworkActorCoinBalanceView
						selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
