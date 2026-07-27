<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.MevRelay_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const mevRelayTimestamp = $derived(selection({
		fields: {
			reachable: true,
			statusCode: true,
		},
	}))
	const titleFallback = $derived([String(pendingEntity.reachable ?? ''), String(pendingEntity.statusCode ?? ''), String(pendingEntity.timestampMs ?? '')].filter(Boolean).join(' ') || 'MEV relay timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$relay.$network ?
						String(caip2StringFromValue(selection.entitySelector.$relay.$network.caip2))
					:
						String(selection.entitySelector.$relay.$network.slug)
				),
				host: String(selection.entitySelector.$relay.host),
				timestampMs: String(selection.entitySelector.timestampMs),
				source: String(selection.entitySelector.source),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={mevRelayTimestamp}>
			{#snippet children(entity)}
				{[String(entity.reachable ?? ''), String(entity.statusCode ?? ''), String(pendingEntity.timestampMs)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevRelayTimestamp}>
			{#snippet children(entity)}
				{[String(entity.reachable ?? ''), String(entity.statusCode ?? '')].filter(Boolean).join(' ') || [String(entity.reachable ?? ''), String(entity.statusCode ?? ''), String(pendingEntity.timestampMs)].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<MevRelayView
				selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={mevRelayTimestamp}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mevRelayTimestamp}
			>
				{#snippet children(entity)}
					{@const statusCode = entity.statusCode}
					{#if statusCode != null}
						<div>
							<dt>Status code</dt>
							<dd>
								{String(statusCode)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>Error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							deliveredPayloadSampleCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deliveredPayloadSampleCount = entity.deliveredPayloadSampleCount}
					{#if deliveredPayloadSampleCount != null}
						<div>
							<dt>Delivered payload sample count</dt>
							<dd>
								<NumberValue
									value={deliveredPayloadSampleCount}
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
							builderSampleCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const builderSampleCount = entity.builderSampleCount}
					{#if builderSampleCount != null}
						<div>
							<dt>Builder sample count</dt>
							<dd>
								<NumberValue
									value={builderSampleCount}
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
							sampleLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sampleLimit = entity.sampleLimit}
					{#if sampleLimit != null}
						<div>
							<dt>Sample limit</dt>
							<dd>
								<NumberValue
									value={sampleLimit}
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
					selection({
						fields: {
							windowStartSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const windowStartSlot = entity.windowStartSlot}
					{#if windowStartSlot != null}
						<div>
							<dt>Window start slot</dt>
							<dd>
								<NumberValue
									value={windowStartSlot}
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
							windowEndSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const windowEndSlot = entity.windowEndSlot}
					{#if windowEndSlot != null}
						<div>
							<dt>Window end slot</dt>
							<dd>
								<NumberValue
									value={windowEndSlot}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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

			<div>
				<dt>Relay</dt>
				<dd>
					<MevRelayView
						selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
