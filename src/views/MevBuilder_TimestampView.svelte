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
	}: EntitySelectionViewProps<EntityType.MevBuilder_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const mevBuilderTimestamp = $derived(selection({
		fields: {
			deliveredPayloadCount: true,
			deliveredValueWei: true,
		},
	}))
	const titleFallback = $derived(([(String(pendingEntity.deliveredPayloadCount ?? '') ? String(pendingEntity.deliveredPayloadCount ?? '') + ' payloads' : ''), (String(pendingEntity.deliveredValueWei ?? '') ? String(pendingEntity.deliveredValueWei ?? '') + ' wei' : '')].filter(Boolean).join(' ')) || 'MEV builder timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<EntityView
	entityType={EntityType.MevBuilder_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]/(mevBuilder)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$builder.$network ?
						String(caip2StringFromValue(selection.entitySelector.$builder.$network.caip2))
					:
						String(selection.entitySelector.$builder.$network.slug)
				),
				builderPubkey: String(selection.entitySelector.$builder.builderPubkey),
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
		<ResourceBoundary resource={mevBuilderTimestamp}>
			{#snippet children(entity)}
				{([(String(entity.deliveredPayloadCount ?? '') ? String(entity.deliveredPayloadCount ?? '') + ' payloads' : ''), (String(entity.deliveredValueWei ?? '') ? String(entity.deliveredValueWei ?? '') + ' wei' : '')].filter(Boolean).join(' ')) || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevBuilderTimestamp}>
			{#snippet children(entity)}
				{@const deliveredPayloadCount0 = entity.deliveredPayloadCount}
				{#if deliveredPayloadCount0 != null}
					<NumberValue
						value={deliveredPayloadCount0}
					/>

					<span> payloads</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<MevBuilderView
				selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={mevBuilderTimestamp}
			>
				{#snippet children(entity)}
					{@const deliveredPayloadCount = entity.deliveredPayloadCount}
					{#if deliveredPayloadCount != null}
						<div>
							<dt>Delivered payload count</dt>
							<dd>
								<NumberValue
									value={deliveredPayloadCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mevBuilderTimestamp}
			>
				{#snippet children(entity)}
					{@const deliveredValueWei = entity.deliveredValueWei}
					{#if deliveredValueWei != null}
						<div>
							<dt>Delivered value</dt>
							<dd>
								<NumberValue
									value={deliveredValueWei}
								/>

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							relayCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const relayCount = entity.relayCount}
					{#if relayCount != null}
						<div>
							<dt>Relay count</dt>
							<dd>
								<NumberValue
									value={relayCount}
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
				<dt>Builder</dt>
				<dd>
					<MevBuilderView
						selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
