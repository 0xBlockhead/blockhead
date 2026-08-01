<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TonTrace> = $props()

	const viewDomId = $derived('ton-trace-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TonMessageView from '$/views/TonMessageView.svelte'
	import TonTransactionsView from '$/views/TonTransactionsView.svelte'
	import TonMessagesView from '$/views/TonMessagesView.svelte'
	import TonTrace_TimestampsView from '$/views/TonTrace_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TonTrace}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'TON trace'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>trace ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									traceId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.traceId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>root message</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$rootMessage}
					>
						{#snippet children(tonMessage)}
							<TonMessageView
								selection={select(EntityType.TonMessage, tonMessage[EntityMetaKey.Selector])}
								prefetched={tonMessage}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
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
				{#snippet children(entity)}
					{@const startedAtMs = entity.startedAtMs}
					{#if startedAtMs != null}
						<div>
							<dt>started AT ms</dt>
							<dd>
								{startedAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTonTraceTransactions({ id, label })}
				<TonTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTonTraceMessages({ id, label })}
				<TonMessagesView
					selection={selection.$$messages}
					collapsible={false}
					title={label}
					emptyText='No messages.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTonTraceTimestamps({ id, label })}
				<TonTrace_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
