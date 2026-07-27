<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
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
	}: EntitySelectionViewProps<EntityType.BlockheadSessionSimulationLog> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadSessionSimulationLog = $derived(viewSelection({
		fields: {
			address: true,
			callPath: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.logIndex ?? '') || 'blockhead session simulation log')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSessionSimulationView from '$/views/BlockheadSessionSimulationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSessionSimulationLog}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={pendingEntity.logIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSessionSimulationLog}>
			{#snippet children(entity)}
				{String(entity.address ?? '') || String(pendingEntity.logIndex) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSessionSimulationLog}>
			{#snippet children(entity)}
				{@const callPath0 = entity.callPath}
				{#if callPath0 != null}
					<span data-text="muted">
						{callPath0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>simulation</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$simulation}
					>
						{#snippet children(blockheadSessionSimulation)}
							<BlockheadSessionSimulationView
								selection={select(EntityType.BlockheadSessionSimulation, blockheadSessionSimulation[EntityMetaKey.Selector])}
								prefetched={blockheadSessionSimulation}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>log index</dt>
				<dd>
					<NumberValue
						value={pendingEntity.logIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadSessionSimulationLog}
			>
				{#snippet children(entity)}
					{@const callPath = entity.callPath}
					{#if callPath != null}
						<div>
							<dt>call path</dt>
							<dd>
								{callPath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadSessionSimulationLog}
			>
				{#snippet children(entity)}
					{@const address = entity.address}
					{#if address != null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String(address)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							topic0: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const topic0 = entity.topic0}
					{#if topic0 != null}
						<div>
							<dt>topic0</dt>
							<dd>
								{String(topic0)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>topics</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									topics: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.topics.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							dataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dataHash = entity.dataHash}
					{#if dataHash != null}
						<div>
							<dt>data hash</dt>
							<dd>
								<TruncatedValue value={String(dataHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							decodedEventName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const decodedEventName = entity.decodedEventName}
					{#if decodedEventName != null}
						<div>
							<dt>decoded event name</dt>
							<dd>
								{decodedEventName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							removed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const removed = entity.removed}
					{#if removed != null}
						<div>
							<dt>removed</dt>
							<dd>
								{removed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
