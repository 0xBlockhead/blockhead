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
			selection: EntityProxyResource<typeof schema, EntityType.TonJetton>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonJetton>>
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
	const tonJetton = $derived(selection({}))
	const titleFallback = $derived('TON jetton')
	const viewDomId = $derived('ton-jetton-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonNetworkView from '$/views/TonNetworkView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import TonJettonTransfersView from '$/views/TonJettonTransfersView.svelte'
	import TonJettonBalance_TimestampsView from '$/views/TonJettonBalance_TimestampsView.svelte'
	import TonJetton_TimestampsView from '$/views/TonJetton_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TonJetton}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonJetton}>
			{#snippet Pending()}
				{title || 'TON jetton'}
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
					<TonNetworkView
						selection={select(EntityType.TonNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>master address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									masterAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const masterAddress = pendingEntity.masterAddress}
							{#if masterAddress !== undefined && masterAddress !== null}
								<TruncatedValue value={String((masterAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const masterAddress = resolvedEntity.masterAddress}
							{#if masterAddress !== undefined && masterAddress !== null}
								<TruncatedValue value={String((masterAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$masterAccount}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tonAccount)}
					{#if tonAccount != null && tonAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>master account</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, tonAccount[EntityMetaKey.Selector])}
									prefetched={tonAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
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
				id={viewDomId + '-carousel-ton-jetton-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ton-jetton-transfers',
							label: 'Transfers',
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

				{#snippet SectionTonJettonTransfers({ id, label, open })}
					<TonJettonTransfersView
						selection={selection.$$transfers}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No transfers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-ton-jetton-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ton-jetton-balance-timestamps',
							label: 'Balance Timestamps',
						},
						{
							id: 'ton-jetton-timestamps',
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

				{#snippet SectionTonJettonBalanceTimestamps({ id, label, open })}
					<TonJettonBalance_TimestampsView
						selection={selection.$$balanceTimestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No balance timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonJettonTimestamps({ id, label, open })}
					<TonJetton_TimestampsView
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
