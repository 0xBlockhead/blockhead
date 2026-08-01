<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntitySelectionViewProps<EntityType.KaspaNetwork> = $props()

	const viewDomId = $derived('kaspa-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import KaspaVirtualChain_TimestampsView from '$/views/KaspaVirtualChain_TimestampsView.svelte'
	import KaspaAddressesView from '$/views/KaspaAddressesView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'kaspa network'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		Kaspa
	{/snippet}

	{#snippet Content({ open: contentOpen })}
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
				<EntitiesList
					entityType={EntityType.KaspaNetwork_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No Kaspa network observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: kaspaNetworkTimestamp })}
						<EntityView
							entityType={EntityType.KaspaNetwork_Timestamp}
							entitySelector={kaspaNetworkTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionKaspaVirtualChain({ id, label, open })}
				<KaspaVirtualChain_TimestampsView
					selection={selection.$$virtualChainTimestamps}
					collapsible={false}
					title={label}
					emptyText='No Kaspa virtual-chain observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaChainBlocks({ id, label, open })}
				<EntitiesList
					entityType={EntityType.KaspaBlock}
					collapsible={false}
					title={label}
					emptyText='No Kaspa blocks.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$blocks()}
				>
					{#snippet Item({ item: kaspaBlock })}
						<EntityView
							entityType={EntityType.KaspaBlock}
							entitySelector={kaspaBlock[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionKaspaChainTransactions({ id, label, open })}
				<EntitiesList
					entityType={EntityType.KaspaTransaction}
					collapsible={false}
					title={label}
					emptyText='No Kaspa transactions.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$transactions()}
				>
					{#snippet Item({ item: kaspaTransaction })}
						<EntityView
							entityType={EntityType.KaspaTransaction}
							entitySelector={kaspaTransaction[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionKaspaAcceptedTransactions({ id, label, open })}
				<EntitiesList
					entityType={EntityType.KaspaAcceptedTransaction}
					collapsible={false}
					title={label}
					emptyText='No Kaspa accepted transactions.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$acceptedTransactions()}
				>
					{#snippet Item({ item: kaspaAcceptedTransaction })}
						<EntityView
							entityType={EntityType.KaspaAcceptedTransaction}
							entitySelector={kaspaAcceptedTransaction[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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
					collapsible={false}
					title={label}
					emptyText='No Kaspa addresses.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
