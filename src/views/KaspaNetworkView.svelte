<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.KaspaNetwork>, 'prefetched'> = $props()

	const viewDomId = $derived('kaspa-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
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
		</dl>
	{/snippet}

	{#snippet Details()}
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

			{#snippet SectionKaspaChainObservations({ id, label })}
				<KaspaNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Kaspa network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaVirtualChain({ id, label })}
				<KaspaVirtualChain_TimestampsView
					selection={selection.$$virtualChainTimestamps}
					collapsible={false}
					title={label}
					emptyText='No Kaspa virtual-chain observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaChainBlocks({ id, label })}
				<KaspaBlocksView
					selection={selection.$$blocks}
					collapsible={false}
					title={label}
					emptyText='No Kaspa blocks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaChainTransactions({ id, label })}
				<KaspaTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No Kaspa transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaAcceptedTransactions({ id, label })}
				<KaspaAcceptedTransactionsView
					selection={selection.$$acceptedTransactions}
					collapsible={false}
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

			{#snippet SectionKaspaAddressList({ id, label })}
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
