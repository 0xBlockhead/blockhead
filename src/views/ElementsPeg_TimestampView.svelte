<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.ElementsPeg_Timestamp>, 'prefetched'> = $props()

	const peg = $derived(selection.entitySelector.$peg)
	const elementsPegTimestamp = $derived(selection({
		fields: {
			status: true,
			confirmations: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ElementsPegView from '$/views/ElementsPegView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsPeg_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(elements)/elements/peg/[pegTransactionId=stringSegment]/[direction=stringSegment]/(elementsPeg)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						peg.$network.$network.caip2 !== undefined ?
							caip2StringFromValue(peg.$network.$network.caip2)
						:
							peg.$network.$network.slug
					),
					pegTransactionId: peg.pegTransactionId,
					direction: peg.direction,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsPegTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={elementsPegTimestamp}>
			{#snippet children(entity)}
				{@const confirmations = entity.confirmations}
				{#if confirmations != null}
					<span data-text="muted">
						<NumberValue
							value={confirmations}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Peg</dt>
				<dd>
					<ElementsPegView
						selection={select(EntityType.ElementsPeg, selection.entitySelector.$peg)}
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
