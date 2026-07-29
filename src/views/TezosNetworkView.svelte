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
	}: EntitySelectionViewProps<EntityType.TezosNetwork> = $props()

	const viewDomId = $derived('tezos-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TezosNetwork_TimestampsView from '$/views/TezosNetwork_TimestampsView.svelte'
	import TezosBlocksView from '$/views/TezosBlocksView.svelte'
	import TezosOperationGroupsView from '$/views/TezosOperationGroupsView.svelte'
	import TezosOperationsView from '$/views/TezosOperationsView.svelte'
	import TezosAccountsView from '$/views/TezosAccountsView.svelte'
	import TezosContractsView from '$/views/TezosContractsView.svelte'
	import TezosBakersView from '$/views/TezosBakersView.svelte'
	import TezosCyclesView from '$/views/TezosCyclesView.svelte'
	import TezosBakingRightsView from '$/views/TezosBakingRightsView.svelte'
	import TezosTokensView from '$/views/TezosTokensView.svelte'
	import TezosTokenTransfersView from '$/views/TezosTokenTransfersView.svelte'
	import TezosBigMapsView from '$/views/TezosBigMapsView.svelte'
	import TezosBigMapKeysView from '$/views/TezosBigMapKeysView.svelte'
	import TezosBigMap_TimestampsView from '$/views/TezosBigMap_TimestampsView.svelte'
	import TezosBigMapKey_TimestampsView from '$/views/TezosBigMapKey_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'tezos network'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
			open={false}
		/>
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
			id={viewDomId + '-carousel-tezos-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tezos-chain-observations',
						label: 'Observations',
					},
					{
						id: 'tezos-chain-blocks',
						label: 'Blocks',
					},
					{
						id: 'tezos-chain-operation-groups',
						label: 'Operation groups',
					},
					{
						id: 'tezos-chain-operations',
						label: 'Operations',
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

			{#snippet SectionTezosChainObservations({ id, label, open })}
				<TezosNetwork_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosChainBlocks({ id, label, open })}
				<TezosBlocksView
					selection={selection.$$blocks}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos blocks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosChainOperationGroups({ id, label, open })}
				<TezosOperationGroupsView
					selection={selection.$$operationGroups}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos operation groups.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosChainOperations({ id, label, open })}
				<TezosOperationsView
					selection={selection.$$operations}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos operations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-tezos-accounts-contracts'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tezos-accounts',
						label: 'Accounts',
					},
					{
						id: 'tezos-contracts',
						label: 'Contracts',
					},
				]
			}
			data-card
			class='network-view-collapsible-accounts-contracts'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Accounts and contracts</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTezosAccounts({ id, label, open })}
				<TezosAccountsView
					selection={selection.$$accounts}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos accounts.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosContracts({ id, label, open })}
				<TezosContractsView
					selection={selection.$$contracts}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos contracts.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-tezos-baking-cycles'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tezos-bakers',
						label: 'Bakers',
					},
					{
						id: 'tezos-cycles',
						label: 'Cycles',
					},
					{
						id: 'tezos-baking-rights',
						label: 'Baking rights',
					},
				]
			}
			data-card
			class='network-view-collapsible-baking-cycles'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Bakers and cycles</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTezosBakers({ id, label, open })}
				<TezosBakersView
					selection={selection.$$bakers}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos bakers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosCycles({ id, label, open })}
				<TezosCyclesView
					selection={selection.$$cycles}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos cycles.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosBakingRights({ id, label, open })}
				<TezosBakingRightsView
					selection={selection.$$bakingRights}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos baking rights.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-tezos-tokens'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tezos-token-list',
						label: 'Tokens',
					},
					{
						id: 'tezos-token-transfers',
						label: 'Token transfers',
					},
				]
			}
			data-card
			class='network-view-collapsible-tokens'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Tokens</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTezosTokenList({ id, label, open })}
				<TezosTokensView
					selection={selection.$$tokens}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos tokens.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosTokenTransfers({ id, label, open })}
				<TezosTokenTransfersView
					selection={selection.$$tokenTransfers}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos token transfers.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-tezos-big-maps'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tezos-big-map-list',
						label: 'Big maps',
					},
					{
						id: 'tezos-big-map-keys',
						label: 'Big map keys',
					},
					{
						id: 'tezos-big-map-observations',
						label: 'Big map observations',
					},
					{
						id: 'tezos-big-map-key-observations',
						label: 'Big map key observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-big-maps'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Big maps</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTezosBigMapList({ id, label, open })}
				<TezosBigMapsView
					selection={selection.$$bigMaps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos big maps.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosBigMapKeys({ id, label, open })}
				<TezosBigMapKeysView
					selection={selection.$$bigMapKeys}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos big map keys.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosBigMapObservations({ id, label, open })}
				<TezosBigMap_TimestampsView
					selection={selection.$$bigMapTimestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos big map observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosBigMapKeyObservations({ id, label, open })}
				<TezosBigMapKey_TimestampsView
					selection={selection.$$bigMapKeyTimestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Tezos big map key observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
