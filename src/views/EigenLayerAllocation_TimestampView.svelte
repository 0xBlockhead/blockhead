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
	}: Omit<EntitySelectionViewProps<EntityType.EigenLayerAllocation_Timestamp>, 'prefetched'> = $props()

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
	import EigenLayerOperatorView from '$/views/EigenLayerOperatorView.svelte'
	import EigenLayerAvsView from '$/views/EigenLayerAvsView.svelte'
	import EigenLayerStrategyView from '$/views/EigenLayerStrategyView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerAllocation_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'eigen layer allocation timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/operator/[operatorAddress=evmAddress]/(eigenLayerOperator)/avs/[avsAddress=evmAddress]/strategy/[strategyAddress=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in operator.$network ?
							caip2StringFromValue(operator.$network.caip2)
						:
							operator.$network.slug
					),
					operatorAddress: operator.operatorAddress,
					avsAddress: selection.entitySelector.$avs.avsAddress,
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
		<EigenLayerOperatorView
			selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<EigenLayerAvsView
			selection={select(EntityType.EigenLayerAvs, selection.entitySelector.$avs)}
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
				<dt>operator</dt>
				<dd>
					<EigenLayerOperatorView
						selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>AVS</dt>
				<dd>
					<EigenLayerAvsView
						selection={select(EntityType.EigenLayerAvs, selection.entitySelector.$avs)}
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
							allocationMagnitude: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const allocationMagnitude = entity.allocationMagnitude}
					{#if allocationMagnitude != null}
						<div>
							<dt>allocation magnitude</dt>
							<dd>
								<NumberValue
									value={allocationMagnitude}
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
							allocatedShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const allocatedShares = entity.allocatedShares}
					{#if allocatedShares != null}
						<div>
							<dt>allocated shares</dt>
							<dd>
								<NumberValue
									value={allocatedShares}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>quorum numbers</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									quorumNumbers: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.quorumNumbers.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							registrationStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const registrationStatus = entity.registrationStatus}
					{#if registrationStatus != null}
						<div>
							<dt>registration status</dt>
							<dd>
								{registrationStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							slashableUntilMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slashableUntilMs = entity.slashableUntilMs}
					{#if slashableUntilMs != null}
						<div>
							<dt>slashable until ms</dt>
							<dd>
								<Timestamp timestamp={slashableUntilMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							operatorSetId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const operatorSetId = entity.operatorSetId}
					{#if operatorSetId != null}
						<div>
							<dt>operator set ID</dt>
							<dd>
								{operatorSetId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
