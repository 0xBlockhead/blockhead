<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.EigenLayerDelegation_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.EigenLayerSubgraph_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const titleFallback = 'eigen layer delegation timestamp'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EigenLayerOperatorView from '$/views/EigenLayerOperatorView.svelte'
	import EigenLayerStrategyView from '$/views/EigenLayerStrategyView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerDelegation_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EvmNetworkAccountView
			selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$staker)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<EigenLayerOperatorView
			selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EigenLayerStrategyView
				selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>staker</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$staker)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>operator</dt>
				<dd>
					<EigenLayerOperatorView
						selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>strategy</dt>
				<dd>
					<EigenLayerStrategyView
						selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							delegatedShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegatedShares = entity.delegatedShares}
					{#if delegatedShares != null}
						<div>
							<dt>delegated shares</dt>
							<dd>
								<NumberValue
									value={delegatedShares}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							underlyingTokenAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const underlyingTokenAmount = entity.underlyingTokenAmount}
					{#if underlyingTokenAmount != null}
						<div>
							<dt>underlying token amount</dt>
							<dd>
								<NumberValue
									value={underlyingTokenAmount}
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
							depositRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const depositRoot = entity.depositRoot}
					{#if depositRoot != null}
						<div>
							<dt>deposit root</dt>
							<dd>
								{String(depositRoot)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							withdrawalRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const withdrawalRoot = entity.withdrawalRoot}
					{#if withdrawalRoot != null}
						<div>
							<dt>withdrawal root</dt>
							<dd>
								{String(withdrawalRoot)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							withdrawalQueued: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const withdrawalQueued = entity.withdrawalQueued}
					{#if withdrawalQueued != null}
						<div>
							<dt>withdrawal queued</dt>
							<dd>
								{withdrawalQueued ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							withdrawalCompleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const withdrawalCompleted = entity.withdrawalCompleted}
					{#if withdrawalCompleted != null}
						<div>
							<dt>withdrawal completed</dt>
							<dd>
								{withdrawalCompleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
