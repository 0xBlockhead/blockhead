<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BalancerAccountPoolBalance>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Balancer_Rest,
		],
	}))
	const balancerAccountPoolBalance = $derived(viewSelection({
		fields: {
			totalBalance: true,
			totalBalanceUsd: true,
		},
	}))
	const titleFallback = 'Balancer account pool balance'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import BalancerPoolView from '$/views/BalancerPoolView.svelte'
	import BalancerGaugeView from '$/views/BalancerGaugeView.svelte'
</script>


<EntityView
	entityType={EntityType.BalancerAccountPoolBalance}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<BalancerPoolView
			selection={select(EntityType.BalancerPool, selection.entitySelector.$pool)}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={balancerAccountPoolBalance}>
			{#snippet children(entity)}
				{[entity.totalBalance, String(entity.totalBalanceUsd)].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EvmNetworkAccountView
				selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Pool</dt>
				<dd>
					<BalancerPoolView
						selection={select(EntityType.BalancerPool, selection.entitySelector.$pool)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$gauge}
			>
				{#snippet children(balancerGauge)}
					{#if balancerGauge != null}
						<div>
							<dt>Gauge</dt>
							<dd>
								<BalancerGaugeView
									selection={select(EntityType.BalancerGauge, balancerGauge[EntityMetaKey.Selector])}
									prefetched={balancerGauge}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							stakingType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakingType = entity.stakingType}
					{#if stakingType != null}
						<div>
							<dt>Staking type</dt>
							<dd>
								{stakingType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Total balance</dt>
				<dd>
					<ResourceBoundary
						resource={balancerAccountPoolBalance}
					>
						{#snippet children(entity)}
							{entity.totalBalance}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Total balance (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={balancerAccountPoolBalance}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.totalBalanceUsd}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Wallet balance</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									walletBalance: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.walletBalance}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Wallet balance (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									walletBalanceUsd: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.walletBalanceUsd}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
