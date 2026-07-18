<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.MevBuilder_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.MevBuilder_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const mevBuilderTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			deliveredPayloadCount: true,
			deliveredValueWei: true,
		},
	}))
	const titleFallback = $derived([(String((pendingEntity.deliveredPayloadCount) ?? '') ? String((pendingEntity.deliveredPayloadCount) ?? '') + ' payloads' : ''), (String((pendingEntity.deliveredValueWei) ?? '') ? String((pendingEntity.deliveredValueWei) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'MEV builder timestamp')
	const viewDomId = $derived('mev-builder-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<EntityView
	entityType={EntityType.MevBuilder_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$builder !== undefined && pendingEntity.$builder.builderPubkey !== undefined && pendingEntity.$builder.$network !== undefined && pendingEntity.$builder.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			builderPubkey: String(pendingEntity.$builder.builderPubkey ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$builder.$network.caip2) ?? ''),
		}) : pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$builder !== undefined && pendingEntity.$builder.builderPubkey !== undefined && pendingEntity.$builder.$network !== undefined && pendingEntity.$builder.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			builderPubkey: String(pendingEntity.$builder.builderPubkey ?? ''),
			network: String(pendingEntity.$builder.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[(String((pendingEntity.deliveredPayloadCount) ?? '') ? String((pendingEntity.deliveredPayloadCount) ?? '') + ' payloads' : ''), (String((pendingEntity.deliveredValueWei) ?? '') ? String((pendingEntity.deliveredValueWei) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={mevBuilderTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[(String((resolvedEntity.deliveredPayloadCount) ?? '') ? String((resolvedEntity.deliveredPayloadCount) ?? '') + ' payloads' : ''), (String((resolvedEntity.deliveredValueWei) ?? '') ? String((resolvedEntity.deliveredValueWei) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const deliveredPayloadCount0 = pendingEntity.deliveredPayloadCount}
					{#if deliveredPayloadCount0 !== undefined && deliveredPayloadCount0 !== null}
						<NumberValue
							value={deliveredPayloadCount0}
						/>

						<span> payloads</span>
					{/if}
		{:else}
			<ResourceBoundary resource={mevBuilderTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deliveredPayloadCount0 = resolvedEntity.deliveredPayloadCount}
					{#if deliveredPayloadCount0 !== undefined && deliveredPayloadCount0 !== null}
						<NumberValue
							value={deliveredPayloadCount0}
						/>

						<span> payloads</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<span data-text="muted">
				<MevBuilderView
					selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
					href={
						(selection.entitySelector.$builder.builderPubkey !== undefined && selection.entitySelector.$builder.$network !== undefined && selection.entitySelector.$builder.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
							builderPubkey: String(selection.entitySelector.$builder.builderPubkey ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$builder.$network.caip2) ?? ''),
						}) : selection.entitySelector.$builder.builderPubkey !== undefined && selection.entitySelector.$builder.$network !== undefined && selection.entitySelector.$builder.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
							builderPubkey: String(selection.entitySelector.$builder.builderPubkey ?? ''),
							network: String(selection.entitySelector.$builder.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={mevBuilderTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<span data-text="muted">
						<MevBuilderView
							selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
							href={
								(selection.entitySelector.$builder.builderPubkey !== undefined && selection.entitySelector.$builder.$network !== undefined && selection.entitySelector.$builder.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
									builderPubkey: String(selection.entitySelector.$builder.builderPubkey ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$builder.$network.caip2) ?? ''),
								}) : selection.entitySelector.$builder.builderPubkey !== undefined && selection.entitySelector.$builder.$network !== undefined && selection.entitySelector.$builder.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
									builderPubkey: String(selection.entitySelector.$builder.builderPubkey ?? ''),
									network: String(selection.entitySelector.$builder.$network.slug ?? ''),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							deliveredPayloadCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deliveredPayloadCount = resolvedEntity.deliveredPayloadCount}
					{#if deliveredPayloadCount !== undefined && deliveredPayloadCount !== null}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							deliveredValueWei: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deliveredValueWei = resolvedEntity.deliveredValueWei}
					{#if deliveredValueWei !== undefined && deliveredValueWei !== null}
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
						sources: selection.sources,
						fields: {
							relayCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const relayCount = resolvedEntity.relayCount}
					{#if relayCount !== undefined && relayCount !== null}
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
						sources: selection.sources,
						fields: {
							windowStartSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const windowStartSlot = resolvedEntity.windowStartSlot}
					{#if windowStartSlot !== undefined && windowStartSlot !== null}
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
						sources: selection.sources,
						fields: {
							windowEndSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const windowEndSlot = resolvedEntity.windowEndSlot}
					{#if windowEndSlot !== undefined && windowEndSlot !== null}
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
						sources: selection.sources,
						fields: {
							sampleLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sampleLimit = resolvedEntity.sampleLimit}
					{#if sampleLimit !== undefined && sampleLimit !== null}
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
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Builder</dt>
				<dd>
					<MevBuilderView
						selection={select(EntityType.MevBuilder, selection.entitySelector.$builder, {})}
						href={
							(selection.entitySelector.$builder.builderPubkey !== undefined && selection.entitySelector.$builder.$network !== undefined && selection.entitySelector.$builder.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
								builderPubkey: String(selection.entitySelector.$builder.builderPubkey ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$builder.$network.caip2) ?? ''),
							}) : selection.entitySelector.$builder.builderPubkey !== undefined && selection.entitySelector.$builder.$network !== undefined && selection.entitySelector.$builder.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
								builderPubkey: String(selection.entitySelector.$builder.builderPubkey ?? ''),
								network: String(selection.entitySelector.$builder.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
