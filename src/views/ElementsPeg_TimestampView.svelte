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
	}: EntitySelectionViewProps<EntityType.ElementsPeg_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const elementsPegTimestamp = $derived(selection({
		fields: {
			status: true,
			confirmations: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'Elements peg observation')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ElementsPegView from '$/views/ElementsPegView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsPeg_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsPegTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(pendingEntity.timestampMs) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={elementsPegTimestamp}>
			{#snippet children(entity)}
				{@const confirmations0 = entity.confirmations}
				{#if confirmations0 != null}
					<span data-text="muted">
						<NumberValue
							value={confirmations0}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Peg</dt>
				<dd>
					<ElementsPegView
						selection={select(EntityType.ElementsPeg, selection.entitySelector.$peg)}
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
				resource={elementsPegTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={elementsPegTimestamp}
			>
				{#snippet children(entity)}
					{@const confirmations = entity.confirmations}
					{#if confirmations != null}
						<div>
							<dt>Confirmations</dt>
							<dd>
								<NumberValue
									value={confirmations}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedBitcoinHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedBitcoinHeight = entity.observedBitcoinHeight}
					{#if observedBitcoinHeight != null}
						<div>
							<dt>Observed Bitcoin height</dt>
							<dd>
								<NumberValue
									value={observedBitcoinHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedElementsHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedElementsHeight = entity.observedElementsHeight}
					{#if observedElementsHeight != null}
						<div>
							<dt>Observed Elements height</dt>
							<dd>
								<NumberValue
									value={observedElementsHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
