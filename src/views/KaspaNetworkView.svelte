<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.KaspaNetwork> = $props()

	const titleFallback = 'kaspa network'
	const viewDomId = $derived('kaspa-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import KaspaNetwork_TimestampsView from '$/views/KaspaNetwork_TimestampsView.svelte'
	import KaspaVirtualChain_TimestampsView from '$/views/KaspaVirtualChain_TimestampsView.svelte'
	import KaspaBlocksView from '$/views/KaspaBlocksView.svelte'
	import KaspaTransactionsView from '$/views/KaspaTransactionsView.svelte'
	import KaspaAcceptedTransactionsView from '$/views/KaspaAcceptedTransactionsView.svelte'
	import KaspaAddressesView from '$/views/KaspaAddressesView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		{titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-kaspa-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'kaspa-chain-observations',
						label: 'Observations',
					},
					{
						id: 'kaspa-virtual-chain',
						label: 'Virtual chain',
					},
					{
						id: 'kaspa-chain-blocks',
						label: 'Blocks',
					},
					{
						id: 'kaspa-chain-transactions',
						label: 'Transactions',
					},
					{
						id: 'kaspa-accepted-transactions',
						label: 'Accepted transactions',
					},
				]
			}
			data-card
			class='network-view-collapsible-chain-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Chain activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionKaspaChainObservations({ id, label, open })}
				<KaspaNetwork_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Kaspa network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaVirtualChain({ id, label, open })}
				<KaspaVirtualChain_TimestampsView
					selection={selection.$$virtualChainTimestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Kaspa virtual-chain observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaChainBlocks({ id, label, open })}
				<KaspaBlocksView
					selection={selection.$$blocks}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Kaspa blocks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaChainTransactions({ id, label, open })}
				<KaspaTransactionsView
					selection={selection.$$transactions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Kaspa transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaAcceptedTransactions({ id, label, open })}
				<KaspaAcceptedTransactionsView
					selection={selection.$$acceptedTransactions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Kaspa accepted transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-kaspa-addresses'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'kaspa-address-list',
						label: 'Addresses',
					},
				]
			}
			data-card
			class='network-view-collapsible-addresses'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Addresses</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionKaspaAddressList({ id, label, open })}
				<KaspaAddressesView
					selection={selection.$$addresses}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Kaspa addresses.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
