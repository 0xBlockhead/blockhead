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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const mevRelayTimestamp = $derived(selection({
		fields: {
			reachable: true,
			statusCode: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.reachable) ?? ''), String((prefetched.statusCode) ?? ''), String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'MEV relay timestamp')
	const viewDomId = $derived('mev-relay-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.$relay !== undefined && pendingEntity.$relay.$network !== undefined && pendingEntity.$relay.$network.caip2 !== undefined && pendingEntity.$relay.$network.caip2.namespace !== undefined && pendingEntity.$relay !== undefined && pendingEntity.$relay.$network !== undefined && pendingEntity.$relay.$network.caip2 !== undefined && pendingEntity.$relay.$network.caip2.reference !== undefined && pendingEntity.$relay !== undefined && pendingEntity.$relay.host !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]/timestamp/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(pendingEntity.$relay.$network.caip2.namespace ?? '')}:${String(pendingEntity.$relay.$network.caip2.reference ?? '')}`,
			host: String(pendingEntity.$relay.host ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={mevRelayTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.reachable) ?? ''), String((prefetched.statusCode) ?? ''), String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'MEV relay timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.reachable) ?? ''), String((resolvedEntity.statusCode) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevRelayTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.reachable) ?? ''), String((prefetched.statusCode) ?? '')].filter(Boolean).join(' ') || [String((prefetched.reachable) ?? ''), String((prefetched.statusCode) ?? ''), String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'MEV relay timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.reachable) ?? ''), String((resolvedEntity.statusCode) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.reachable) ?? ''), String((resolvedEntity.statusCode) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mevRelayTimestamp}>
			{#snippet Pending()}
				<span data-text="muted">
					<MevRelayView
						selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
						href={
							(selection.entitySelector.$relay.$network !== undefined && selection.entitySelector.$relay.$network.caip2 !== undefined && selection.entitySelector.$relay.$network.caip2.namespace !== undefined && selection.entitySelector.$relay.$network !== undefined && selection.entitySelector.$relay.$network.caip2 !== undefined && selection.entitySelector.$relay.$network.caip2.reference !== undefined && selection.entitySelector.$relay.host !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]', {
								caip2: `${String(selection.entitySelector.$relay.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$relay.$network.caip2.reference ?? '')}`,
								host: String(selection.entitySelector.$relay.host ?? ''),
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
					<MevRelayView
						selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
						href={
							(selection.entitySelector.$relay.$network !== undefined && selection.entitySelector.$relay.$network.caip2 !== undefined && selection.entitySelector.$relay.$network.caip2.namespace !== undefined && selection.entitySelector.$relay.$network !== undefined && selection.entitySelector.$relay.$network.caip2 !== undefined && selection.entitySelector.$relay.$network.caip2.reference !== undefined && selection.entitySelector.$relay.host !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]', {
								caip2: `${String(selection.entitySelector.$relay.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$relay.$network.caip2.reference ?? '')}`,
								host: String(selection.entitySelector.$relay.host ?? ''),
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
							reachable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							statusCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const statusCode = prefetched.statusCode}
					{#if statusCode !== undefined && statusCode !== null}
						<div>
							<dt>Status code</dt>
							<dd>
								{String((statusCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = prefetched.error}
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
						fields: {
							deliveredPayloadSampleCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deliveredPayloadSampleCount = prefetched.deliveredPayloadSampleCount}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deliveredPayloadSampleCount = resolvedEntity.deliveredPayloadSampleCount}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							builderSampleCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const builderSampleCount = prefetched.builderSampleCount}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const builderSampleCount = resolvedEntity.builderSampleCount}
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
					{@const sampleLimit = prefetched.sampleLimit}
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
					{@const windowStartSlot = prefetched.windowStartSlot}
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
					{@const windowEndSlot = prefetched.windowEndSlot}
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
				<dt>Relay</dt>
				<dd>
					<MevRelayView
						selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
						href={
							(selection.entitySelector.$relay.$network !== undefined && selection.entitySelector.$relay.$network.caip2 !== undefined && selection.entitySelector.$relay.$network.caip2.namespace !== undefined && selection.entitySelector.$relay.$network !== undefined && selection.entitySelector.$relay.$network.caip2 !== undefined && selection.entitySelector.$relay.$network.caip2.reference !== undefined && selection.entitySelector.$relay.host !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]', {
								caip2: `${String(selection.entitySelector.$relay.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$relay.$network.caip2.reference ?? '')}`,
								host: String(selection.entitySelector.$relay.host ?? ''),
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
