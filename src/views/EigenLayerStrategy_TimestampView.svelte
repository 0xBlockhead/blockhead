<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EigenLayerStrategy_Timestamp>, 'prefetched'> = $props()

	const strategy = $derived(selection.entitySelector.$strategy)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const eigenLayerStrategyTimestamp = $derived(viewSelection({
		fields: {
			totalShares: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EigenLayerStrategyView from '$/views/EigenLayerStrategyView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerStrategy_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'eigen layer strategy timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/strategy/[strategyAddress=evmAddress]/(eigenLayerStrategy)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in strategy.$network ?
							caip2StringFromValue(strategy.$network.caip2)
						:
							strategy.$network.slug
					),
					strategyAddress: strategy.strategyAddress,
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
		<EigenLayerStrategyView
			selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eigenLayerStrategyTimestamp}>
			{#snippet children(entity)}
				{@const totalShares = entity.totalShares}
				{#if totalShares != null}
					<span data-text="muted">
						<NumberValue
							value={totalShares}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
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
							blockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue
									value={blockNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={eigenLayerStrategyTimestamp}
			>
				{#snippet children(entity)}
					{@const totalShares = entity.totalShares}
					{#if totalShares != null}
						<div>
							<dt>total shares</dt>
							<dd>
								<NumberValue
									value={totalShares}
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
							totalUnderlying: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalUnderlying = entity.totalUnderlying}
					{#if totalUnderlying != null}
						<div>
							<dt>total underlying</dt>
							<dd>
								<NumberValue
									value={totalUnderlying}
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
							stakerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakerCount = entity.stakerCount}
					{#if stakerCount != null}
						<div>
							<dt>staker count</dt>
							<dd>
								<NumberValue
									value={stakerCount}
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
							delegationCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegationCount = entity.delegationCount}
					{#if delegationCount != null}
						<div>
							<dt>delegation count</dt>
							<dd>
								<NumberValue
									value={delegationCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
