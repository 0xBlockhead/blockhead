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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetContract>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StarknetContract>>
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
	const starknetContract = $derived(selection({
		sources: [
			Source.Juno_JsonRpc,
			Source.Pathfinder_JsonRpc,
			Source.Starknet_JsonRpc,
			Source.Starkscan_Rest,
			Source.Voyager_Rest,
		],
	}))
	const titleFallback = $derived([String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'starknet contract')
	const viewDomId = $derived('starknet-contract-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetNetworkView from '$/views/StarknetNetworkView.svelte'
	import StarknetAccount_TimestampsView from '$/views/StarknetAccount_TimestampsView.svelte'
	import StarknetEventsView from '$/views/StarknetEventsView.svelte'
	import StarknetStorageEntriesView from '$/views/StarknetStorageEntriesView.svelte'
	import StarknetTransactionsView from '$/views/StarknetTransactionsView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetContract}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={starknetContract}>
			{#snippet Pending()}
				{[String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || title || 'starknet contract'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetContract}>
			{#snippet Pending()}
				<StarknetNetworkView
					selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<StarknetNetworkView
					selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StarknetNetworkView
						selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const address = pendingEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-starknet-contract-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'starknet-contract-account-states',
							label: 'Account States',
						},
						{
							id: 'starknet-contract-events',
							label: 'Events',
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

				{#snippet SectionStarknetContractAccountStates({ id, label, open })}
					<StarknetAccount_TimestampsView
						selection={selection.$$accountStates}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No account states.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStarknetContractEvents({ id, label, open })}
					<StarknetEventsView
						selection={selection.$$events}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No events.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-starknet-contract-related'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'starknet-contract-storage',
							label: 'Storage',
						},
						{
							id: 'starknet-contract-transactions',
							label: 'Transactions',
						},
					]
				}
				data-card
				class='network-view-collapsible-related'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Related</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionStarknetContractStorage({ id, label, open })}
					<StarknetStorageEntriesView
						selection={selection.$$storage}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No storage.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStarknetContractTransactions({ id, label, open })}
					<StarknetTransactionsView
						selection={selection.$$transactions}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
