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
	}: EntitySelectionViewProps<EntityType.TonNftCollection> = $props()

	const viewDomId = $derived('ton-nft-collection-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import TonNftItemsView from '$/views/TonNftItemsView.svelte'
	import TonNftTransfersView from '$/views/TonNftTransfersView.svelte'
	import TonNftCollection_TimestampsView from '$/views/TonNftCollection_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TonNftCollection}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'TON NFT collection'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>collection address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.collectionAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(tonAccount)}
					{#if tonAccount != null}
						<div>
							<dt>account</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, tonAccount[EntityMetaKey.Selector])}
									prefetched={tonAccount}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTonNftCollectionItems({ id, label })}
				<TonNftItemsView
					selection={selection.$$items}
					collapsible={false}
					title={label}
					emptyText='No items.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTonNftCollectionTransfers({ id, label })}
				<TonNftTransfersView
					selection={selection.$$transfers}
					collapsible={false}
					title={label}
					emptyText='No transfers.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTonNftCollectionTimestamps({ id, label })}
				<TonNftCollection_TimestampsView
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
