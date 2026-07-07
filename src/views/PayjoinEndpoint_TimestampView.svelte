<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.PayjoinEndpoint_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PayjoinEndpoint_Timestamp>>
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
	const payjoinEndpointTimestamp = $derived(selection({
		fields: {
			responseStatus: true,
			error: true,
			requiresOhttp: true,
			supportsOutputSubstitution: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'payjoin endpoint timestamp')
	const viewDomId = $derived('payjoin-endpoint-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={payjoinEndpointTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={payjoinEndpointTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.responseStatus) ?? ''), String((prefetched.error) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'payjoin endpoint timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.responseStatus) ?? ''), String((resolvedEntity.error) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={payjoinEndpointTimestamp}>
			{#snippet Pending()}
				{@const requiresOhttp0 = prefetched.requiresOhttp}
				{#if requiresOhttp0 !== undefined && requiresOhttp0 !== null}
					<span data-text="muted">
						{requiresOhttp0 ? 'Yes' : 'No'}
					</span>
				{/if}
				{@const supportsOutputSubstitution1 = prefetched.supportsOutputSubstitution}
				{#if supportsOutputSubstitution1 !== undefined && supportsOutputSubstitution1 !== null}
					<span data-text="muted">
						{supportsOutputSubstitution1 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>endpoint</dt>
				<dd>
					<PayjoinEndpointView
						selection={select(EntityType.PayjoinEndpoint, selection.entitySelector.$endpoint, {})}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							supportsOutputSubstitution: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const supportsOutputSubstitution = prefetched.supportsOutputSubstitution}
					{#if supportsOutputSubstitution !== undefined && supportsOutputSubstitution !== null}
						<div>
							<dt>supports output substitution</dt>
							<dd>
								{supportsOutputSubstitution ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							requiresOhttp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requiresOhttp = prefetched.requiresOhttp}
					{#if requiresOhttp !== undefined && requiresOhttp !== null}
						<div>
							<dt>requires ohttp</dt>
							<dd>
								{requiresOhttp ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							maxPayloadBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxPayloadBytes = prefetched.maxPayloadBytes}
					{#if maxPayloadBytes !== undefined && maxPayloadBytes !== null}
						<div>
							<dt>max payload bytes</dt>
							<dd>
								<NumberValue value={Number(maxPayloadBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxPayloadBytes = resolvedEntity.maxPayloadBytes}
					{#if maxPayloadBytes !== undefined && maxPayloadBytes !== null}
						<div>
							<dt>max payload bytes</dt>
							<dd>
								<NumberValue value={Number(maxPayloadBytes)} />
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
							lastSeenAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastSeenAt = prefetched.lastSeenAt}
					{#if lastSeenAt !== undefined && lastSeenAt !== null}
						<div>
							<dt>last seen AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSeenAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							responseStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const responseStatus = prefetched.responseStatus}
					{#if responseStatus !== undefined && responseStatus !== null}
						<div>
							<dt>response status</dt>
							<dd>
								<NumberValue value={Number(responseStatus)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const responseStatus = resolvedEntity.responseStatus}
					{#if responseStatus !== undefined && responseStatus !== null}
						<div>
							<dt>response status</dt>
							<dd>
								<NumberValue value={Number(responseStatus)} />
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
							<dt>error</dt>
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
