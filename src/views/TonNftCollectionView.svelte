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
			selection: EntityProxyResource<typeof schema, EntityType.TonNftCollection>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonNftCollection>>
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
	const tonNftCollection = $derived(selection({}))
	const titleFallback = $derived('TON NFT collection')
	const viewDomId = $derived('ton-nft-collection-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonNetworkView from '$/views/TonNetworkView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import TonNftItemsView from '$/views/TonNftItemsView.svelte'
	import TonNftTransfersView from '$/views/TonNftTransfersView.svelte'
	import TonNftCollection_TimestampsView from '$/views/TonNftCollection_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TonNftCollection}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonNftCollection}>
			{#snippet Pending()}
				{title || 'TON NFT collection'}
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
				<dt>collection address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									collectionAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const collectionAddress = pendingEntity.collectionAddress}
							{#if collectionAddress !== undefined && collectionAddress !== null}
								<TruncatedValue value={String((collectionAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const collectionAddress = resolvedEntity.collectionAddress}
							{#if collectionAddress !== undefined && collectionAddress !== null}
								<TruncatedValue value={String((collectionAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tonAccount)}
					{#if tonAccount != null && tonAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>account</dt>
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
				id={viewDomId + '-carousel-ton-nft-collection-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ton-nft-collection-items',
							label: 'Items',
						},
						{
							id: 'ton-nft-collection-transfers',
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

				{#snippet SectionTonNftCollectionItems({ id, label, open })}
					<TonNftItemsView
						selection={selection.$$items}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No items.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonNftCollectionTransfers({ id, label, open })}
					<TonNftTransfersView
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
				id={viewDomId + '-carousel-ton-nft-collection-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ton-nft-collection-timestamps',
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

				{#snippet SectionTonNftCollectionTimestamps({ id, label, open })}
					<TonNftCollection_TimestampsView
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
