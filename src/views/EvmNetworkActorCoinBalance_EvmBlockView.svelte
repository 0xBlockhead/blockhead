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


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
	entitySelector={selection.entitySelector}
	title={title ?? 'EVM network actor coin balance EVM block'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EvmBlockView
			selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkActorCoinBalanceEvmBlock}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.balance}
					decimalPlaces={selection.entitySelector.$actorCoin.decimals}
				/>

				<span>{selection.entitySelector.$actorCoin.symbol == null ? '' : ` ${selection.entitySelector.$actorCoin.symbol}`}</span>
				{@const usdValue = entity.usdValue}
				{#if usdValue != null}
					{usdValue}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EvmNetworkActorCoinBalanceView
				selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
				layout={EntityLayout.Title}
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
					/>
				</dd>
			</div>

			<div>
				<dt>Actor coin</dt>
				<dd>
					<EvmNetworkActorCoinBalanceView
						selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
						layout={EntityLayout.Value}
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
								decimalPlaces={selection.entitySelector.$actorCoin.decimals}
							/>

							<span>{selection.entitySelector.$actorCoin.symbol == null ? '' : ` ${selection.entitySelector.$actorCoin.symbol}`}</span>
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
								{usdValue}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
