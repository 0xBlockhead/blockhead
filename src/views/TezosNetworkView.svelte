<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.TezosNetwork>, 'prefetched'> = $props()

	const viewDomId = $derived('tezos-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
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
		/>
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

			{#snippet SectionTezosChainObservations({ id, label })}
				<TezosNetwork_TimestampsView
					selection={
						selection
						.$$timestamps({
							sources: [
								Source.Tzkt_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Tezos network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosChainBlocks({ id, label })}
				<TezosBlocksView
					selection={
						selection
						.$$blocks({
							sources: [
								Source.Tzkt_Rest,
								Source.TezosDappetizer_Postgres,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Tezos blocks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosChainOperationGroups({ id, label })}
				<TezosOperationGroupsView
					selection={
						selection
						.$$operationGroups({
							sources: [
								Source.Tzkt_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Tezos operation groups.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosChainOperations({ id, label })}
				<TezosOperationsView
					selection={
						selection
						.$$operations({
							sources: [
								Source.Tzkt_Rest,
							],
						})
					}
					collapsible={false}
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

			{#snippet SectionTezosAccounts({ id, label })}
				<TezosAccountsView
					selection={
						selection
						.$$accounts({
							sources: [
								Source.Tzkt_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Tezos accounts.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosContracts({ id, label })}
				<TezosContractsView
					selection={
						selection
						.$$contracts({
							sources: [
								Source.Tzkt_Rest,
								Source.TezosDappetizer_Postgres,
							],
						})
					}
					collapsible={false}
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

			{#snippet SectionTezosBakers({ id, label })}
				<TezosBakersView
					selection={selection.$$bakers}
					collapsible={false}
					title={label}
					emptyText='No Tezos bakers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosCycles({ id, label })}
				<TezosCyclesView
					selection={selection.$$cycles}
					collapsible={false}
					title={label}
					emptyText='No Tezos cycles.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosBakingRights({ id, label })}
				<TezosBakingRightsView
					selection={selection.$$bakingRights}
					collapsible={false}
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

			{#snippet SectionTezosTokenList({ id, label })}
				<TezosTokensView
					selection={
						selection
						.$$tokens({
							sources: [
								Source.Tzkt_Rest,
								Source.TezosDappetizer_Postgres,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Tezos tokens.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosTokenTransfers({ id, label })}
				<TezosTokenTransfersView
					selection={
						selection
						.$$tokenTransfers({
							sources: [
								Source.Tzkt_Rest,
								Source.TezosDappetizer_Postgres,
							],
						})
					}
					collapsible={false}
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

			{#snippet SectionTezosBigMapList({ id, label })}
				<TezosBigMapsView
					selection={selection.$$bigMaps}
					collapsible={false}
					title={label}
					emptyText='No Tezos big maps.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosBigMapKeys({ id, label })}
				<TezosBigMapKeysView
					selection={selection.$$bigMapKeys}
					collapsible={false}
					title={label}
					emptyText='No Tezos big map keys.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosBigMapObservations({ id, label })}
				<TezosBigMap_TimestampsView
					selection={selection.$$bigMapTimestamps}
					collapsible={false}
					title={label}
					emptyText='No Tezos big map observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosBigMapKeyObservations({ id, label })}
				<TezosBigMapKey_TimestampsView
					selection={selection.$$bigMapKeyTimestamps}
					collapsible={false}
					title={label}
					emptyText='No Tezos big map key observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
