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
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentService>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.A2aAgentService>>
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
	const a2aAgentService = $derived(selection({
		sources: [
			Source.A2aWellKnown_Http,
		],
		fields: {
			transportKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || 'A2A agent service')
	const viewDomId = $derived('a2a-agent-service-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={a2aAgentService}>
			{#snippet Pending()}
				{[String((pendingEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || title || 'A2A agent service'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={a2aAgentService}>
			{#snippet Pending()}
				{[String((pendingEntity.protocolBinding) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || title || 'A2A agent service'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.protocolBinding) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.endpointUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aAgentService}>
			{#snippet Pending()}
				{@const transportKind0 = pendingEntity.transportKind}
				{#if transportKind0 !== undefined && transportKind0 !== null}
					<span data-text="muted">
						{String((transportKind0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>card</dt>
				<dd>
					<A2aAgentCardView
						selection={select(EntityType.A2aAgentCard, selection.entitySelector.$card, {})}
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
								fields: {
									protocolBinding: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const protocolBinding = pendingEntity.protocolBinding}
							{#if protocolBinding !== undefined && protocolBinding !== null}
								{String((protocolBinding) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									endpointUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const endpointUrl = pendingEntity.endpointUrl}
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
						fields: {
							transportKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transportKind = pendingEntity.transportKind}
					{#if transportKind !== undefined && transportKind !== null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{String((transportKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							authKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const authKind = pendingEntity.authKind}
					{#if authKind !== undefined && authKind !== null}
						<div>
							<dt>auth kind</dt>
							<dd>
								{String((authKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<A2aTasksView
				selection={selection.$$tasks}
				title='tasks'
				emptyText='No A2A tasks.'
				id='A2aTasksView-tasks'
			/>

			<A2aAgentService_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No A2A service observations.'
				id='A2aAgentService_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
