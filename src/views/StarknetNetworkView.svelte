<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.StarknetNetwork>, 'prefetched'> = $props()

	const starknetNetwork = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.Juno_JsonRpc,
			Source.L2Beat_Rest,
			Source.Pathfinder,
			Source.Starkscan,
			Source.Voyager,
		],
		fields: {
			chainId: true,
		},
	}))
	const titleFallback = 'starknet network'
	const viewDomId = $derived('starknet-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import StarknetNetwork_TimestampsView from '$/views/StarknetNetwork_TimestampsView.svelte'
	import StarknetBlocksView from '$/views/StarknetBlocksView.svelte'
	import StarknetTransactionsView from '$/views/StarknetTransactionsView.svelte'
	import StarknetContractsView from '$/views/StarknetContractsView.svelte'
	import StarknetClassesView from '$/views/StarknetClassesView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetNetwork}
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
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetNetwork}>
			{#snippet children(entity)}
				{(entity.chainId ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
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

			<ResourceBoundary
				resource={starknetNetwork}
			>
				{#snippet children(entity)}
					{@const chainId = entity.chainId}
					{#if chainId != null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								{chainId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-starknet-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'starknet-chain-observations',
						label: 'Observations',
					},
					{
						id: 'starknet-chain-blocks',
						label: 'Blocks',
					},
					{
						id: 'starknet-chain-transactions',
						label: 'Transactions',
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

			{#snippet SectionStarknetChainObservations({ id, label })}
				<StarknetNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Starknet network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStarknetChainBlocks({ id, label })}
				<StarknetBlocksView
					selection={selection.$$blocks}
					collapsible={false}
					title={label}
					emptyText='No Starknet blocks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStarknetChainTransactions({ id, label })}
				<StarknetTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No Starknet transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-starknet-execution'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'starknet-contracts',
						label: 'Contracts',
					},
					{
						id: 'starknet-classes',
						label: 'Classes',
					},
				]
			}
			data-card
			class='network-view-collapsible-execution'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Accounts, classes, and contracts</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionStarknetContracts({ id, label })}
				<StarknetContractsView
					selection={selection.$$contracts}
					collapsible={false}
					title={label}
					emptyText='No Starknet contracts.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStarknetClasses({ id, label })}
				<StarknetClassesView
					selection={selection.$$classes}
					collapsible={false}
					title={label}
					emptyText='No Starknet classes.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
