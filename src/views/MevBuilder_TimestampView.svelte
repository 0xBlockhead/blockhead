<!-- Generated from APP.ts. -->

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

	const builder = $derived(selection.entitySelector.$builder)
	const mevBuilderTimestamp = $derived(selection({
		fields: {
			deliveredPayloadCount: true,
			deliveredValueWei: true,
		},
	}))
	const titleFallback = $derived([(prefetched.deliveredPayloadCount != null ? String(prefetched.deliveredPayloadCount) + ' payloads' : ''), (prefetched.deliveredValueWei != null ? String(prefetched.deliveredValueWei) + ' wei' : '')].filter(Boolean).join(' ') || 'MEV builder timestamp')


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
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]/(mevBuilder)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in builder.$network ?
							caip2StringFromValue(builder.$network.caip2)
						:
							builder.$network.slug
					),
					builderPubkey: builder.builderPubkey,
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
		<ResourceBoundary resource={mevBuilderTimestamp}>
			{#snippet children(entity)}
				{[(entity.deliveredPayloadCount != null ? String(entity.deliveredPayloadCount) + ' payloads' : ''), (entity.deliveredValueWei != null ? String(entity.deliveredValueWei) + ' wei' : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevBuilderTimestamp}>
			{#snippet children(entity)}
				{@const deliveredPayloadCount = entity.deliveredPayloadCount}
				{#if deliveredPayloadCount != null}
					<NumberValue
						value={deliveredPayloadCount}
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
			/>
		</span>
	{/snippet}

	{#snippet Content()}
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
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Builder</dt>
				<dd>
					<MevBuilderView
						selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
