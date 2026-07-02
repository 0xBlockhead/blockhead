<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const mevBuilderTimestamp = $derived(selection({
		fields: {
			deliveredPayloadCount: true,
			deliveredValueWei: true,
			relayCount: true,
			windowStartSlot: true,
			windowEndSlot: true,
			sampleLimit: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).deliveredPayloadCount) ?? '') + ' payloads', String((({ ...selection.entitySelector, ...prefetched }).deliveredValueWei) ?? '') + ' wei'].filter(Boolean).join(' ') || 'MEV builder timestamp')
	const viewDomId = $derived('mev-builder-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<EntityView
	entityType={EntityType.MevBuilder_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]/timestamp/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$builder.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$builder.$network.caip2.reference)}`,
			builderPubkey: String(({ ...selection.entitySelector, ...prefetched }).$builder.builderPubkey),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).deliveredPayloadCount) ?? '') + ' payloads', String((({ ...selection.entitySelector, ...prefetched }).deliveredValueWei) ?? '') + ' wei'].filter(Boolean).join(' ') || title || 'MEV builder timestamp'}
		{:else}
			<ResourceBoundary resource={mevBuilderTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).deliveredPayloadCount) ?? '') + ' payloads', String((({ ...selection.entitySelector, ...prefetched }).deliveredValueWei) ?? '') + ' wei'].filter(Boolean).join(' ') || title || 'MEV builder timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.deliveredPayloadCount) ?? '') + ' payloads', String((entity.deliveredValueWei) ?? '') + ' wei'].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const deliveredPayloadCount0 = ({ ...selection.entitySelector, ...prefetched }).deliveredPayloadCount}
			{#if deliveredPayloadCount0 !== undefined && deliveredPayloadCount0 !== null}
				<NumberValue value={Number(deliveredPayloadCount0)} />

				<span> payloads</span>
			{/if}
		{:else}
			<ResourceBoundary resource={mevBuilderTimestamp}>
				{#snippet Pending()}
					{@const deliveredPayloadCount0 = ({ ...selection.entitySelector, ...prefetched }).deliveredPayloadCount}
					{#if deliveredPayloadCount0 !== undefined && deliveredPayloadCount0 !== null}
						<NumberValue value={Number(deliveredPayloadCount0)} />

						<span> payloads</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const deliveredPayloadCount0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).deliveredPayloadCount}
					{#if deliveredPayloadCount0 !== undefined && deliveredPayloadCount0 !== null}
						<NumberValue value={Number(deliveredPayloadCount0)} />

						<span> payloads</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<MevBuilderView
					selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
					href={
						resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
							caip2: `${String(selection.entitySelector.$builder.$network.caip2.namespace)}:${String(selection.entitySelector.$builder.$network.caip2.reference)}`,
							builderPubkey: String(selection.entitySelector.$builder.builderPubkey),
						})
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={mevBuilderTimestamp}>
				{#snippet Pending()}
					<span data-text="muted">
						<MevBuilderView
							selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
							href={
								resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
									caip2: `${String(selection.entitySelector.$builder.$network.caip2.namespace)}:${String(selection.entitySelector.$builder.$network.caip2.reference)}`,
									builderPubkey: String(selection.entitySelector.$builder.builderPubkey),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<MevBuilderView
							selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
							href={
								resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
									caip2: `${String(selection.entitySelector.$builder.$network.caip2.namespace)}:${String(selection.entitySelector.$builder.$network.caip2.reference)}`,
									builderPubkey: String(selection.entitySelector.$builder.builderPubkey),
								})
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
			<ResourceBoundary resource={mevBuilderTimestamp}>
				{#snippet Pending()}
					{@const relayCount = prefetched.relayCount ?? selection.entitySelector.relayCount}
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
					{@const relayCount = entity.relayCount ?? selection.entitySelector.relayCount ?? prefetched.relayCount}
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
			<ResourceBoundary resource={mevBuilderTimestamp}>
				{#snippet Pending()}
					{@const windowStartSlot = prefetched.windowStartSlot ?? selection.entitySelector.windowStartSlot}
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
					{@const windowStartSlot = entity.windowStartSlot ?? selection.entitySelector.windowStartSlot ?? prefetched.windowStartSlot}
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

			<ResourceBoundary resource={mevBuilderTimestamp}>
				{#snippet Pending()}
					{@const windowEndSlot = prefetched.windowEndSlot ?? selection.entitySelector.windowEndSlot}
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
					{@const windowEndSlot = entity.windowEndSlot ?? selection.entitySelector.windowEndSlot ?? prefetched.windowEndSlot}
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

			<ResourceBoundary resource={mevBuilderTimestamp}>
				{#snippet Pending()}
					{@const sampleLimit = prefetched.sampleLimit ?? selection.entitySelector.sampleLimit}
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
					{@const sampleLimit = entity.sampleLimit ?? selection.entitySelector.sampleLimit ?? prefetched.sampleLimit}
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
					<ResourceBoundary resource={mevBuilderTimestamp}>
						{#snippet Pending()}
							{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
					<ResourceBoundary resource={mevBuilderTimestamp}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
