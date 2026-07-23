<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.PayjoinEndpoint_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.PayjoinEndpoint_Timestamp>
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
	const payjoinEndpointTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			responseStatus: true,
			error: true,
			requiresOhttp: true,
			supportsOutputSubstitution: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			responseStatus: true,
			error: true,
			requiresOhttp: true,
			supportsOutputSubstitution: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'payjoin endpoint timestamp')
	const viewDomId = $derived('payjoin-endpoint-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import PayjoinEndpointView from '$/views/PayjoinEndpointView.svelte'
</script>


<EntityView
	entityType={EntityType.PayjoinEndpoint_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'responseStatus') && Object.hasOwn(prefetched, 'error') && Object.hasOwn(prefetched, 'requiresOhttp') && Object.hasOwn(prefetched, 'supportsOutputSubstitution')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={payjoinEndpointTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'responseStatus') && Object.hasOwn(prefetched, 'error') && Object.hasOwn(prefetched, 'requiresOhttp') && Object.hasOwn(prefetched, 'supportsOutputSubstitution')}
			{[String((pendingEntity.responseStatus) ?? ''), String((pendingEntity.error) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={payjoinEndpointTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.responseStatus) ?? ''), String((resolvedEntity.error) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'responseStatus') && Object.hasOwn(prefetched, 'error') && Object.hasOwn(prefetched, 'requiresOhttp') && Object.hasOwn(prefetched, 'supportsOutputSubstitution')}
			{@const requiresOhttp0 = pendingEntity.requiresOhttp}
			{#if requiresOhttp0 !== undefined && requiresOhttp0 !== null}
				<span data-text="muted">
					{requiresOhttp0 ? 'Yes' : 'No'}
				</span>
			{/if}
			{@const supportsOutputSubstitution1 = pendingEntity.supportsOutputSubstitution}
			{#if supportsOutputSubstitution1 !== undefined && supportsOutputSubstitution1 !== null}
				<span data-text="muted">
					{supportsOutputSubstitution1 ? 'Yes' : 'No'}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={payjoinEndpointTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requiresOhttp0 = resolvedEntity.requiresOhttp}
					{#if requiresOhttp0 !== undefined && requiresOhttp0 !== null}
						<span data-text="muted">
							{requiresOhttp0 ? 'Yes' : 'No'}
						</span>
					{/if}
					{@const supportsOutputSubstitution1 = resolvedEntity.supportsOutputSubstitution}
					{#if supportsOutputSubstitution1 !== undefined && supportsOutputSubstitution1 !== null}
						<span data-text="muted">
							{supportsOutputSubstitution1 ? 'Yes' : 'No'}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>endpoint</dt>
				<dd>
					<PayjoinEndpointView
						selection={select(EntityType.PayjoinEndpoint, selection.entitySelector.$endpoint)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							supportsOutputSubstitution: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const supportsOutputSubstitution = resolvedEntity.supportsOutputSubstitution}
					{#if supportsOutputSubstitution !== undefined && supportsOutputSubstitution !== null}
						<div>
							<dt>supports output substitution</dt>
							<dd>
								{supportsOutputSubstitution ? 'Yes' : 'No'}
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
							requiresOhttp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requiresOhttp = resolvedEntity.requiresOhttp}
					{#if requiresOhttp !== undefined && requiresOhttp !== null}
						<div>
							<dt>requires ohttp</dt>
							<dd>
								{requiresOhttp ? 'Yes' : 'No'}
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
							maxPayloadBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxPayloadBytes = resolvedEntity.maxPayloadBytes}
					{#if maxPayloadBytes !== undefined && maxPayloadBytes !== null}
						<div>
							<dt>max payload bytes</dt>
							<dd>
								<NumberValue
									value={maxPayloadBytes}
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
							lastSeenAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastSeenAt = resolvedEntity.lastSeenAt}
					{#if lastSeenAt !== undefined && lastSeenAt !== null}
						<div>
							<dt>last seen AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSeenAt)} />
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
							responseStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const responseStatus = resolvedEntity.responseStatus}
					{#if responseStatus !== undefined && responseStatus !== null}
						<div>
							<dt>response status</dt>
							<dd>
								<NumberValue
									value={responseStatus}
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
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
