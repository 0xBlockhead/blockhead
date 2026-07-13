<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.MevBuilder_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MevBuilder_Timestamp>>
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
		href ?? (pendingEntity.$builder !== undefined && pendingEntity.$builder.$network !== undefined && pendingEntity.$builder.$network.slug !== undefined && pendingEntity.$builder.builderPubkey !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			network: String(pendingEntity.$builder.$network.slug ?? ''),
			builderPubkey: String(pendingEntity.$builder.builderPubkey ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={mevBuilderTimestamp}>
			{#snippet Pending()}
				{[(String((pendingEntity.deliveredPayloadCount) ?? '') ? String((pendingEntity.deliveredPayloadCount) ?? '') + ' payloads' : ''), (String((pendingEntity.deliveredValueWei) ?? '') ? String((pendingEntity.deliveredValueWei) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || title || 'MEV builder timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[(String((resolvedEntity.deliveredPayloadCount) ?? '') ? String((resolvedEntity.deliveredPayloadCount) ?? '') + ' payloads' : ''), (String((resolvedEntity.deliveredValueWei) ?? '') ? String((resolvedEntity.deliveredValueWei) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevBuilderTimestamp}>
			{#snippet Pending()}
				{@const deliveredPayloadCount0 = pendingEntity.deliveredPayloadCount}
				{#if deliveredPayloadCount0 !== undefined && deliveredPayloadCount0 !== null}
					<NumberValue value={Number(deliveredPayloadCount0)} />

					<span> payloads</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const deliveredPayloadCount0 = resolvedEntity.deliveredPayloadCount}
				{#if deliveredPayloadCount0 !== undefined && deliveredPayloadCount0 !== null}
					<NumberValue value={Number(deliveredPayloadCount0)} />

					<span> payloads</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mevBuilderTimestamp}>
			{#snippet Pending()}
				<span data-text="muted">
					<MevBuilderView
						selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
						href={
							(selection.entitySelector.$builder.$network !== undefined && selection.entitySelector.$builder.$network.slug !== undefined && selection.entitySelector.$builder.builderPubkey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
								network: String(selection.entitySelector.$builder.$network.slug ?? ''),
								builderPubkey: String(selection.entitySelector.$builder.builderPubkey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<MevBuilderView
						selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
						href={
							(selection.entitySelector.$builder.$network !== undefined && selection.entitySelector.$builder.$network.slug !== undefined && selection.entitySelector.$builder.builderPubkey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
								network: String(selection.entitySelector.$builder.$network.slug ?? ''),
								builderPubkey: String(selection.entitySelector.$builder.builderPubkey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							deliveredPayloadCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deliveredPayloadCount = pendingEntity.deliveredPayloadCount}
					{#if deliveredPayloadCount !== undefined && deliveredPayloadCount !== null}
						<div>
							<dt>Delivered payload count</dt>
							<dd>
								<NumberValue value={Number(deliveredPayloadCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deliveredPayloadCount = resolvedEntity.deliveredPayloadCount}
					{#if deliveredPayloadCount !== undefined && deliveredPayloadCount !== null}
						<div>
							<dt>Delivered payload count</dt>
							<dd>
								<NumberValue value={Number(deliveredPayloadCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deliveredValueWei: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deliveredValueWei = pendingEntity.deliveredValueWei}
					{#if deliveredValueWei !== undefined && deliveredValueWei !== null}
						<div>
							<dt>Delivered value</dt>
							<dd>
								<NumberValue value={Number(deliveredValueWei)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deliveredValueWei = resolvedEntity.deliveredValueWei}
					{#if deliveredValueWei !== undefined && deliveredValueWei !== null}
						<div>
							<dt>Delivered value</dt>
							<dd>
								<NumberValue value={Number(deliveredValueWei)} />

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
				{#snippet Pending()}
					{@const relayCount = pendingEntity.relayCount}
					{#if relayCount !== undefined && relayCount !== null}
						<div>
							<dt>Relay count</dt>
							<dd>
								<NumberValue value={Number(relayCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const relayCount = resolvedEntity.relayCount}
					{#if relayCount !== undefined && relayCount !== null}
						<div>
							<dt>Relay count</dt>
							<dd>
								<NumberValue value={Number(relayCount)} />
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
				{#snippet Pending()}
					{@const windowStartSlot = pendingEntity.windowStartSlot}
					{#if windowStartSlot !== undefined && windowStartSlot !== null}
						<div>
							<dt>Window start slot</dt>
							<dd>
								<NumberValue value={Number(windowStartSlot)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const windowStartSlot = resolvedEntity.windowStartSlot}
					{#if windowStartSlot !== undefined && windowStartSlot !== null}
						<div>
							<dt>Window start slot</dt>
							<dd>
								<NumberValue value={Number(windowStartSlot)} />
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
				{#snippet Pending()}
					{@const windowEndSlot = pendingEntity.windowEndSlot}
					{#if windowEndSlot !== undefined && windowEndSlot !== null}
						<div>
							<dt>Window end slot</dt>
							<dd>
								<NumberValue value={Number(windowEndSlot)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const windowEndSlot = resolvedEntity.windowEndSlot}
					{#if windowEndSlot !== undefined && windowEndSlot !== null}
						<div>
							<dt>Window end slot</dt>
							<dd>
								<NumberValue value={Number(windowEndSlot)} />
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
				{#snippet Pending()}
					{@const sampleLimit = pendingEntity.sampleLimit}
					{#if sampleLimit !== undefined && sampleLimit !== null}
						<div>
							<dt>Sample limit</dt>
							<dd>
								<NumberValue value={Number(sampleLimit)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sampleLimit = resolvedEntity.sampleLimit}
					{#if sampleLimit !== undefined && sampleLimit !== null}
						<div>
							<dt>Sample limit</dt>
							<dd>
								<NumberValue value={Number(sampleLimit)} />
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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
							(selection.entitySelector.$builder.$network !== undefined && selection.entitySelector.$builder.$network.slug !== undefined && selection.entitySelector.$builder.builderPubkey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
								network: String(selection.entitySelector.$builder.$network.slug ?? ''),
								builderPubkey: String(selection.entitySelector.$builder.builderPubkey ?? ''),
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
