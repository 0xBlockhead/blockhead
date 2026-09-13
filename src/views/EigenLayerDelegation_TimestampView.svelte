<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EigenLayerDelegation_Timestamp>, 'prefetched'> = $props()

	const operator = $derived(selection.entitySelector.$operator)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.EigenExplorer_Rest,
		],
	}))


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
	title={title ?? 'eigen layer delegation timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/operator/[operatorAddress=evmAddress]/(eigenLayerOperator)/delegation/staker/[stakerAddress=evmAddress]/strategy/[strategyAddress=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						operator.$network.caip2 !== undefined ?
							caip2StringFromValue(operator.$network.caip2)
						:
							operator.$network.slug
					),
					operatorAddress: operator.operatorAddress,
					stakerAddress: selection.entitySelector.$staker.$actor.address,
					strategyAddress: selection.entitySelector.$strategy.strategyAddress,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EvmNetworkAccountView
			selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$staker)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<EigenLayerOperatorView
			selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EigenLayerStrategyView
				selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>staker</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$staker)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>operator</dt>
				<dd>
					<EigenLayerOperatorView
						selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>strategy</dt>
				<dd>
					<EigenLayerStrategyView
						selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

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
								{depositRoot}
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
								{withdrawalRoot}
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
