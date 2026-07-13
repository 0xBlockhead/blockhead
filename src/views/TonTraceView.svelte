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
			selection: EntityProxyResource<typeof schema, EntityType.TonTrace>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonTrace>>
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
	const tonTrace = $derived(selection({}))
	const titleFallback = $derived('TON trace')
	const viewDomId = $derived('ton-trace-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TonNetworkView from '$/views/TonNetworkView.svelte'
	import TonMessageView from '$/views/TonMessageView.svelte'
	import TonTransactionsView from '$/views/TonTransactionsView.svelte'
	import TonMessagesView from '$/views/TonMessagesView.svelte'
	import TonTrace_TimestampsView from '$/views/TonTrace_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TonTrace}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonTrace}>
			{#snippet Pending()}
				{title || 'TON trace'}
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
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(tonNetwork)}
							{#if tonNetwork != null && tonNetwork[EntityMetaKey.Selector] != null}
								<TonNetworkView
									selection={select(EntityType.TonNetwork, tonNetwork[EntityMetaKey.Selector])}
									prefetched={tonNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							traceId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const traceId = pendingEntity.traceId}
					{#if traceId !== undefined && traceId !== null}
						<div>
							<dt>trace ID</dt>
							<dd>
								{String((traceId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const traceId = resolvedEntity.traceId}
					{#if traceId !== undefined && traceId !== null}
						<div>
							<dt>trace ID</dt>
							<dd>
								{String((traceId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$rootMessage}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tonMessage)}
					{#if tonMessage != null && tonMessage[EntityMetaKey.Selector] != null}
						<div>
							<dt>root message</dt>
							<dd>
								<TonMessageView
									selection={select(EntityType.TonMessage, tonMessage[EntityMetaKey.Selector])}
									prefetched={tonMessage}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
							startedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startedAtMs = pendingEntity.startedAtMs}
					{#if startedAtMs !== undefined && startedAtMs !== null}
						<div>
							<dt>started AT ms</dt>
							<dd>
								{String((startedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startedAtMs = resolvedEntity.startedAtMs}
					{#if startedAtMs !== undefined && startedAtMs !== null}
						<div>
							<dt>started AT ms</dt>
							<dd>
								{String((startedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-ton-trace-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ton-trace-transactions',
							label: 'Transactions',
						},
						{
							id: 'ton-trace-messages',
							label: 'Messages',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTonTraceTransactions({ id, label, open })}
					<TonTransactionsView
						selection={selection.$$transactions}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonTraceMessages({ id, label, open })}
					<TonMessagesView
						selection={selection.$$messages}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No messages.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-ton-trace-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ton-trace-timestamps',
							label: 'Timestamps',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTonTraceTimestamps({ id, label, open })}
					<TonTrace_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
