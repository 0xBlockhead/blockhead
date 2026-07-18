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
	import { UrlString } from '$/schema/UrlString.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadAgentConnection>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadAgentConnection>>
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
	const blockheadAgentConnection = $derived(selection({
		sources: selection.sources,
		fields: {
			connectionKind: true,
			enabled: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.connectionId) ?? '')].filter(Boolean).join(' ') || 'blockhead agent connection')
	const viewDomId = $derived('blockhead-agent-connection-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentConnection_TimestampsView from '$/views/BlockheadAgentConnection_TimestampsView.svelte'
	import BlockheadAgentProfileView from '$/views/BlockheadAgentProfileView.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConnection}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.connectionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadAgentConnection}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.connectionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.connectionKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.connectionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadAgentConnection}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.connectionKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.connectionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const enabled0 = pendingEntity.enabled}
			{#if enabled0 !== undefined && enabled0 !== null}
				<span data-text="muted">
					{enabled0 ? 'Yes' : 'No'}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadAgentConnection}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const enabled0 = resolvedEntity.enabled}
					{#if enabled0 !== undefined && enabled0 !== null}
						<span data-text="muted">
							{enabled0 ? 'Yes' : 'No'}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									connectionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const connectionId = resolvedEntity.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$profile}
			>
				{#snippet children(blockheadAgentProfile)}
					{#if blockheadAgentProfile != null && blockheadAgentProfile[EntityMetaKey.Selector] != null}
						<div>
							<dt>profile</dt>
							<dd>
								<BlockheadAgentProfileView
									selection={select(EntityType.BlockheadAgentProfile, blockheadAgentProfile[EntityMetaKey.Selector])}
									prefetched={blockheadAgentProfile}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$source}
			>
				{#snippet children(blockheadSource)}
					{#if blockheadSource != null && blockheadSource[EntityMetaKey.Selector] != null}
						<div>
							<dt>Source</dt>
							<dd>
								<BlockheadSourceView
									selection={select(EntityType.BlockheadSource, blockheadSource[EntityMetaKey.Selector])}
									prefetched={blockheadSource}
									href={
										(blockheadSource[EntityMetaKey.Selector].id !== undefined ? resolve('/~/manage/source/[sourceId=stringSegment]', {
											sourceId: String(blockheadSource[EntityMetaKey.Selector].id ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
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
							connectionKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const connectionKind = resolvedEntity.connectionKind}
					{#if connectionKind !== undefined && connectionKind !== null}
						<div>
							<dt>connection kind</dt>
							<dd>
								{String((connectionKind) ?? '')}
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
							endpointUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endpointUrl = resolvedEntity.endpointUrl}
					{#if endpointUrl !== undefined && endpointUrl !== null}
						<div>
							<dt>endpoint URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpointUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpointUrl)} />
								</svelte:element>
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
							authKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authKind = resolvedEntity.authKind}
					{#if authKind !== undefined && authKind !== null}
						<div>
							<dt>auth kind</dt>
							<dd>
								{String((authKind) ?? '')}
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
							enabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const enabled = resolvedEntity.enabled}
					{#if enabled !== undefined && enabled !== null}
						<div>
							<dt>enabled</dt>
							<dd>
								{enabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadAgentConnection_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No agent connection observations.'
				id='BlockheadAgentConnection_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
