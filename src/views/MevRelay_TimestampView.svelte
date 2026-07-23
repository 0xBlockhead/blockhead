<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.MevRelay_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.MevRelay_Timestamp>
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
	const mevRelayTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			reachable: true,
			statusCode: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			reachable: true,
			statusCode: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.reachable) ?? ''), String((pendingEntity.statusCode) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'MEV relay timestamp')
	const viewDomId = $derived('mev-relay-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && 'source' in selection.entitySelector
			&& selection.entitySelector.source != null
			&& selection.entitySelector != null && '$relay' in selection.entitySelector
			&& selection.entitySelector.$relay != null && 'host' in selection.entitySelector.$relay
			&& selection.entitySelector.$relay.host != null
			&& selection.entitySelector.$relay != null && '$network' in selection.entitySelector.$relay ?
				selection.entitySelector.$relay.$network != null && 'caip2' in selection.entitySelector.$relay.$network
				&& selection.entitySelector.$relay.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				timestampMs: String(selection.entitySelector.timestampMs ?? ''),
				source: String(selection.entitySelector.source ?? ''),
				host: String(selection.entitySelector.$relay.host ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$relay.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$relay.$network != null && 'slug' in selection.entitySelector.$relay.$network
					&& selection.entitySelector.$relay.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(selection.entitySelector.timestampMs ?? ''),
					source: String(selection.entitySelector.source ?? ''),
					host: String(selection.entitySelector.$relay.host ?? ''),
					network: String(selection.entitySelector.$relay.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={mevRelayTimestamp}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.reachable) ?? ''), String((resolvedEntity.statusCode) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevRelayTimestamp}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.reachable) ?? ''), String((resolvedEntity.statusCode) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.reachable) ?? ''), String((resolvedEntity.statusCode) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mevRelayTimestamp}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<MevRelayView
						selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
						href={
							(
								selection.entitySelector.$relay != null && 'host' in selection.entitySelector.$relay
								&& selection.entitySelector.$relay.host != null
								&& selection.entitySelector.$relay != null && '$network' in selection.entitySelector.$relay ?
									selection.entitySelector.$relay.$network != null && 'caip2' in selection.entitySelector.$relay.$network
									&& selection.entitySelector.$relay.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]', {
									host: String(selection.entitySelector.$relay.host ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$relay.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$relay.$network != null && 'slug' in selection.entitySelector.$relay.$network
										&& selection.entitySelector.$relay.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]', {
										host: String(selection.entitySelector.$relay.host ?? ''),
										network: String(selection.entitySelector.$relay.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
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
						sources: selection.sources,
						fields: {
							reachable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachable = resolvedEntity.reachable}
					{#if reachable !== undefined && reachable !== null}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							statusCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const statusCode = resolvedEntity.statusCode}
					{#if statusCode !== undefined && statusCode !== null}
						<div>
							<dt>Status code</dt>
							<dd>
								{String((statusCode) ?? '')}
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
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
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
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							deliveredPayloadSampleCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deliveredPayloadSampleCount = resolvedEntity.deliveredPayloadSampleCount}
					{#if deliveredPayloadSampleCount !== undefined && deliveredPayloadSampleCount !== null}
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
						sources: selection.sources,
						fields: {
							builderSampleCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const builderSampleCount = resolvedEntity.builderSampleCount}
					{#if builderSampleCount !== undefined && builderSampleCount !== null}
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
				<dt>Relay</dt>
				<dd>
					<MevRelayView
						selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
						href={
							(
								selection.entitySelector.$relay != null && 'host' in selection.entitySelector.$relay
								&& selection.entitySelector.$relay.host != null
								&& selection.entitySelector.$relay != null && '$network' in selection.entitySelector.$relay ?
									selection.entitySelector.$relay.$network != null && 'caip2' in selection.entitySelector.$relay.$network
									&& selection.entitySelector.$relay.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]', {
									host: String(selection.entitySelector.$relay.host ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$relay.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$relay.$network != null && 'slug' in selection.entitySelector.$relay.$network
										&& selection.entitySelector.$relay.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]', {
										host: String(selection.entitySelector.$relay.host ?? ''),
										network: String(selection.entitySelector.$relay.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
