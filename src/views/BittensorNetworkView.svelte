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
	}: EntitySelectionViewProps<EntityType.BittensorNetwork> = $props()

	const viewDomId = $derived('bittensor-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BittensorNetwork_TimestampsView from '$/views/BittensorNetwork_TimestampsView.svelte'
	import BittensorBlocksView from '$/views/BittensorBlocksView.svelte'
	import BittensorSubnetsView from '$/views/BittensorSubnetsView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'Bittensor network'}
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
		Bittensor
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
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
			id={viewDomId + '-carousel-bittensor-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'bittensor-chain-observations',
						label: 'Runtime observations',
					},
					{
						id: 'bittensor-chain-blocks',
						label: 'Blocks',
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

			{#snippet SectionBittensorChainObservations({ id, label, open })}
				<BittensorNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBittensorChainBlocks({ id, label, open })}
				<BittensorBlocksView
					selection={selection.$$blocks}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-bittensor-subnets'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'bittensor-subnet-list',
						label: 'Subnets',
					},
				]
			}
			data-card
			class='network-view-collapsible-subnets'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Subnets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBittensorSubnetList({ id, label, open })}
				<BittensorSubnetsView
					selection={selection.$$subnets}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
