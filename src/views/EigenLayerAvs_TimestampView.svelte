<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.EigenLayerAvs_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const eigenLayerAvsTimestamp = $derived(viewSelection({
		fields: {
			operatorCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EigenLayerAvsView from '$/views/EigenLayerAvsView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerAvs_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'eigen layer avs timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EigenLayerAvsView
			selection={select(EntityType.EigenLayerAvs, selection.entitySelector.$avs)}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eigenLayerAvsTimestamp}>
			{#snippet children(entity)}
				{@const operatorCount = entity.operatorCount}
				{#if operatorCount != null}
					<span data-text="muted">
						<NumberValue
							value={operatorCount}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
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

			<ResourceBoundary
				resource={eigenLayerAvsTimestamp}
			>
				{#snippet children(entity)}
					{@const operatorCount = entity.operatorCount}
					{#if operatorCount != null}
						<div>
							<dt>operator count</dt>
							<dd>
								<NumberValue
									value={operatorCount}
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
							strategyCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const strategyCount = entity.strategyCount}
					{#if strategyCount != null}
						<div>
							<dt>strategy count</dt>
							<dd>
								<NumberValue
									value={strategyCount}
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
		</dl>
	{/snippet}
</EntityView>
