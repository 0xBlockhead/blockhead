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
			selection: RegisteredEntityProxyResource<EntityType.A2aAgentService>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.A2aAgentService>
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
	const a2aAgentService = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			transportKind: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			transportKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || 'A2A agent service')
	const viewDomId = $derived('a2a-agent-service-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aTasksView from '$/views/A2aTasksView.svelte'
	import A2aAgentService_TimestampsView from '$/views/A2aAgentService_TimestampsView.svelte'
	import A2aAgentCardView from '$/views/A2aAgentCardView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aAgentService}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'transportKind')}
			{[String((pendingEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={a2aAgentService}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'transportKind')}
			{[String((pendingEntity.protocolBinding) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={a2aAgentService}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.protocolBinding) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'transportKind')}
			{@const transportKind0 = pendingEntity.transportKind}
			{#if transportKind0 !== undefined && transportKind0 !== null}
				<span data-text="muted">
					{String((transportKind0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={a2aAgentService}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transportKind0 = resolvedEntity.transportKind}
					{#if transportKind0 !== undefined && transportKind0 !== null}
						<span data-text="muted">
							{String((transportKind0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>card</dt>
				<dd>
					<A2aAgentCardView
						selection={select(EntityType.A2aAgentCard, selection.entitySelector.$card)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>protocol binding</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									protocolBinding: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const protocolBinding = resolvedEntity.protocolBinding}
							{#if protocolBinding !== undefined && protocolBinding !== null}
								{String((protocolBinding) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>endpoint URL</dt>
				<dd>
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
								<svelte:element
									this={'a'}
									href={String(endpointUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpointUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							transportKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transportKind = resolvedEntity.transportKind}
					{#if transportKind !== undefined && transportKind !== null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{String((transportKind) ?? '')}
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const a2aAgentServiceA2aTasksViewTasksResource = selection.$$tasks}
		<ResourceBoundary
			resource={a2aAgentServiceA2aTasksViewTasksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<A2aTasksView
					selection={a2aAgentServiceA2aTasksViewTasksResource}
					countResource={a2aAgentServiceA2aTasksViewTasksResource.count}
					title='tasks'
					id='A2aTasksView-tasks'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const a2aAgentServiceA2aAgentServiceTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={a2aAgentServiceA2aAgentServiceTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<A2aAgentService_TimestampsView
					selection={a2aAgentServiceA2aAgentServiceTimestampsViewTimestampsResource}
					countResource={a2aAgentServiceA2aAgentServiceTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='A2aAgentService_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
