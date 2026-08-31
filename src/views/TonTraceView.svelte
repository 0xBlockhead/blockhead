<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TonTrace>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const rootMessage = $derived(selection.entitySelector.$rootMessage)
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
	href={
		href === undefined ?
			(
				'$rootMessage' in selection.entitySelector
				&& 'messageHash' in rootMessage
				&& '$network' in rootMessage ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/ton/[messageHash=stringSegment]/(tonMessage)/trace/[source=stringSegment]',
						{
							network: (
								'caip2' in rootMessage.$network ?
									caip2StringFromValue(rootMessage.$network.caip2)
								:
									rootMessage.$network.slug
							),
							messageHash: rootMessage.messageHash,
							source: selection.entitySelector.source,
						}
					)
				:
					'traceId' in selection.entitySelector
					&& '$network' in selection.entitySelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trace/[traceId=stringSegment]/[traceSource=stringSegment]',
							{
								network: (
									'caip2' in network ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								traceId: selection.entitySelector.traceId,
								traceSource: selection.entitySelector.source,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
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
							{@const networkInitial = untrack(() => network)}
							<NetworkView
								selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
								prefetched={network ?? networkInitial}
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
