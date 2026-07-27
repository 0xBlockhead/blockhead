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
	}: EntitySelectionViewProps<EntityType.EvmNetworkActorCoinBalance_EvmBlock> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const evmNetworkActorCoinBalanceEvmBlock = $derived(selection({
		fields: {
			balance: true,
			$actorCoin: {
				fields: {
					decimals: true,
					symbol: true,
				},
			},
			usdValue: true,
		},
	}))
	const titleFallback = 'EVM network actor coin balance EVM block'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EvmBlockView
			selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkActorCoinBalanceEvmBlock}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.balance}
					decimalPlaces={pendingEntity.$actorCoin.decimals}
				/>

				<span>{pendingEntity.$actorCoin.symbol == null ? '' : ` ${String(pendingEntity.$actorCoin.symbol)}`}</span>
				{@const usdValue1 = entity.usdValue}
				{#if usdValue1 != null}
					{String(usdValue1)}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EvmNetworkActorCoinBalanceView
				selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block</dt>
				<dd>
					<EvmBlockView
						selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Actor coin</dt>
				<dd>
					<EvmNetworkActorCoinBalanceView
						selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Balance</dt>
				<dd>
					<ResourceBoundary
						resource={evmNetworkActorCoinBalanceEvmBlock}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.balance}
								decimalPlaces={pendingEntity.$actorCoin.decimals}
							/>

							<span>{pendingEntity.$actorCoin.symbol == null ? '' : ` ${String(pendingEntity.$actorCoin.symbol)}`}</span>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={evmNetworkActorCoinBalanceEvmBlock}
			>
				{#snippet children(entity)}
					{@const usdValue = entity.usdValue}
					{#if usdValue != null}
						<div>
							<dt>USD value</dt>
							<dd>
								{String(usdValue)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
