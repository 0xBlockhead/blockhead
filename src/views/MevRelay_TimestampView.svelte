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
			selection: EntityProxyResource<typeof schema, EntityType.MevRelay_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MevRelay_Timestamp>>
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

	const mevRelayTimestamp = $derived(selection({
		fields: {
			reachable: true,
			statusCode: true,
			error: true,
			deliveredPayloadSampleCount: true,
			builderSampleCount: true,
			sampleLimit: true,
			windowStartSlot: true,
			windowEndSlot: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).reachable) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).statusCode) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'MEV relay timestamp')
	const viewDomId = $derived('mev-relay-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]/timestamp/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$relay.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$relay.$network.caip2.reference)}`,
			host: String(({ ...selection.entitySelector, ...prefetched }).$relay.host),
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
			{[String((({ ...selection.entitySelector, ...prefetched }).reachable) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).statusCode) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'MEV relay timestamp'}
		{:else}
			<ResourceBoundary resource={mevRelayTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).reachable) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).statusCode) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'MEV relay timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.reachable) ?? ''), String((entity.statusCode) ?? ''), String((entity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).reachable) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).statusCode) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).reachable) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).statusCode) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'MEV relay timestamp'}
		{:else}
			<ResourceBoundary resource={mevRelayTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).reachable) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).statusCode) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).reachable) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).statusCode) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'MEV relay timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.reachable) ?? ''), String((entity.statusCode) ?? '')].filter(Boolean).join(' ') || [String((entity.reachable) ?? ''), String((entity.statusCode) ?? ''), String((entity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<MevRelayView
					selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
					href={
						resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]', {
							caip2: `${String(selection.entitySelector.$relay.$network.caip2.namespace)}:${String(selection.entitySelector.$relay.$network.caip2.reference)}`,
							host: String(selection.entitySelector.$relay.host),
						})
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={mevRelayTimestamp}>
				{#snippet Pending()}
					<span data-text="muted">
						<MevRelayView
							selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
							href={
								resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]', {
									caip2: `${String(selection.entitySelector.$relay.$network.caip2.namespace)}:${String(selection.entitySelector.$relay.$network.caip2.reference)}`,
									host: String(selection.entitySelector.$relay.host),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<MevRelayView
							selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
							href={
								resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]', {
									caip2: `${String(selection.entitySelector.$relay.$network.caip2.namespace)}:${String(selection.entitySelector.$relay.$network.caip2.reference)}`,
									host: String(selection.entitySelector.$relay.host),
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
			<ResourceBoundary resource={mevRelayTimestamp}>
				{#snippet Pending()}
					{@const error = prefetched.error ?? selection.entitySelector.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const error = entity.error ?? selection.entitySelector.error ?? prefetched.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={mevRelayTimestamp}>
				{#snippet Pending()}
					{@const deliveredPayloadSampleCount = prefetched.deliveredPayloadSampleCount ?? selection.entitySelector.deliveredPayloadSampleCount}
					{#if deliveredPayloadSampleCount !== undefined && deliveredPayloadSampleCount !== null}
						<div>
							<dt>Delivered payload sample count</dt>
							<dd>
								<NumberValue value={Number(deliveredPayloadSampleCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const deliveredPayloadSampleCount = entity.deliveredPayloadSampleCount ?? selection.entitySelector.deliveredPayloadSampleCount ?? prefetched.deliveredPayloadSampleCount}
					{#if deliveredPayloadSampleCount !== undefined && deliveredPayloadSampleCount !== null}
						<div>
							<dt>Delivered payload sample count</dt>
							<dd>
								<NumberValue value={Number(deliveredPayloadSampleCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={mevRelayTimestamp}>
				{#snippet Pending()}
					{@const builderSampleCount = prefetched.builderSampleCount ?? selection.entitySelector.builderSampleCount}
					{#if builderSampleCount !== undefined && builderSampleCount !== null}
						<div>
							<dt>Builder sample count</dt>
							<dd>
								<NumberValue value={Number(builderSampleCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const builderSampleCount = entity.builderSampleCount ?? selection.entitySelector.builderSampleCount ?? prefetched.builderSampleCount}
					{#if builderSampleCount !== undefined && builderSampleCount !== null}
						<div>
							<dt>Builder sample count</dt>
							<dd>
								<NumberValue value={Number(builderSampleCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={mevRelayTimestamp}>
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
			<ResourceBoundary resource={mevRelayTimestamp}>
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

			<ResourceBoundary resource={mevRelayTimestamp}>
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

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary resource={mevRelayTimestamp}>
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
