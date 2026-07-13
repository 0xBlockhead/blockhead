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
			selection: EntityProxyResource<typeof schema, EntityType.IcpRequestStatus_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IcpRequestStatus_Timestamp>>
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
	const icpRequestStatusTimestamp = $derived(selection({}))
	const titleFallback = $derived('ICP request status timestamp')
	const viewDomId = $derived('icp-request-status-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpRequestStatusView from '$/views/IcpRequestStatusView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpRequestStatus_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={icpRequestStatusTimestamp}>
			{#snippet Pending()}
				{title || 'ICP request status timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>request status</dt>
				<dd>
					<IcpRequestStatusView
						selection={select(EntityType.IcpRequestStatus, selection.entitySelector.$requestStatus, {})}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = pendingEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							replyHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const replyHash = pendingEntity.replyHash}
					{#if replyHash !== undefined && replyHash !== null}
						<div>
							<dt>reply hash</dt>
							<dd>
								<TruncatedValue value={String((replyHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const replyHash = resolvedEntity.replyHash}
					{#if replyHash !== undefined && replyHash !== null}
						<div>
							<dt>reply hash</dt>
							<dd>
								<TruncatedValue value={String((replyHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rejectCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rejectCode = pendingEntity.rejectCode}
					{#if rejectCode !== undefined && rejectCode !== null}
						<div>
							<dt>reject code</dt>
							<dd>
								{String((rejectCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rejectCode = resolvedEntity.rejectCode}
					{#if rejectCode !== undefined && rejectCode !== null}
						<div>
							<dt>reject code</dt>
							<dd>
								{String((rejectCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rejectMessage: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rejectMessage = pendingEntity.rejectMessage}
					{#if rejectMessage !== undefined && rejectMessage !== null}
						<div>
							<dt>reject message</dt>
							<dd>
								{String((rejectMessage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rejectMessage = resolvedEntity.rejectMessage}
					{#if rejectMessage !== undefined && rejectMessage !== null}
						<div>
							<dt>reject message</dt>
							<dd>
								{String((rejectMessage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							certifiedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const certifiedAtMs = pendingEntity.certifiedAtMs}
					{#if certifiedAtMs !== undefined && certifiedAtMs !== null}
						<div>
							<dt>certified AT ms</dt>
							<dd>
								{String((certifiedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const certifiedAtMs = resolvedEntity.certifiedAtMs}
					{#if certifiedAtMs !== undefined && certifiedAtMs !== null}
						<div>
							<dt>certified AT ms</dt>
							<dd>
								{String((certifiedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							certificateHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const certificateHash = pendingEntity.certificateHash}
					{#if certificateHash !== undefined && certificateHash !== null}
						<div>
							<dt>certificate hash</dt>
							<dd>
								<TruncatedValue value={String((certificateHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const certificateHash = resolvedEntity.certificateHash}
					{#if certificateHash !== undefined && certificateHash !== null}
						<div>
							<dt>certificate hash</dt>
							<dd>
								<TruncatedValue value={String((certificateHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
