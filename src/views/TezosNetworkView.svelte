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
	}: EntitySelectionViewProps<EntityType.TezosNetwork> = $props()

	const viewDomId = $derived('tezos-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
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
				<EntitiesList
					entityType={EntityType.TezosNetwork_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No Tezos network observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: tezosNetworkTimestamp })}
						<EntityView
							entityType={EntityType.TezosNetwork_Timestamp}
							entitySelector={tezosNetworkTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosChainBlocks({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosBlock}
					collapsible={false}
					title={label}
					emptyText='No Tezos blocks.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$blocks()}
				>
					{#snippet Item({ item: tezosBlock })}
						<EntityView
							entityType={EntityType.TezosBlock}
							entitySelector={tezosBlock[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosChainOperationGroups({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosOperationGroup}
					collapsible={false}
					title={label}
					emptyText='No Tezos operation groups.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$operationGroups()}
				>
					{#snippet Item({ item: tezosOperationGroup })}
						<EntityView
							entityType={EntityType.TezosOperationGroup}
							entitySelector={tezosOperationGroup[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosChainOperations({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosOperation}
					collapsible={false}
					title={label}
					emptyText='No Tezos operations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$operations()}
				>
					{#snippet Item({ item: tezosOperation })}
						<EntityView
							entityType={EntityType.TezosOperation}
							entitySelector={tezosOperation[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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
				<EntitiesList
					entityType={EntityType.TezosAccount}
					collapsible={false}
					title={label}
					emptyText='No Tezos accounts.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$accounts()}
				>
					{#snippet Item({ item: tezosAccount })}
						<EntityView
							entityType={EntityType.TezosAccount}
							entitySelector={tezosAccount[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosContracts({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosContract}
					collapsible={false}
					title={label}
					emptyText='No Tezos contracts.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$contracts()}
				>
					{#snippet Item({ item: tezosContract })}
						<EntityView
							entityType={EntityType.TezosContract}
							entitySelector={tezosContract[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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
				<EntitiesList
					entityType={EntityType.TezosBaker}
					collapsible={false}
					title={label}
					emptyText='No Tezos bakers.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$bakers()}
				>
					{#snippet Item({ item: tezosBaker })}
						<EntityView
							entityType={EntityType.TezosBaker}
							entitySelector={tezosBaker[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosCycles({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosCycle}
					collapsible={false}
					title={label}
					emptyText='No Tezos cycles.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$cycles()}
				>
					{#snippet Item({ item: tezosCycle })}
						<EntityView
							entityType={EntityType.TezosCycle}
							entitySelector={tezosCycle[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosBakingRights({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosBakingRight}
					collapsible={false}
					title={label}
					emptyText='No Tezos baking rights.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$bakingRights()}
				>
					{#snippet Item({ item: tezosBakingRight })}
						<EntityView
							entityType={EntityType.TezosBakingRight}
							entitySelector={tezosBakingRight[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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
				<EntitiesList
					entityType={EntityType.TezosToken}
					collapsible={false}
					title={label}
					emptyText='No Tezos tokens.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$tokens()}
				>
					{#snippet Item({ item: tezosToken })}
						<EntityView
							entityType={EntityType.TezosToken}
							entitySelector={tezosToken[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosTokenTransfers({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosTokenTransfer}
					collapsible={false}
					title={label}
					emptyText='No Tezos token transfers.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$tokenTransfers()}
				>
					{#snippet Item({ item: tezosTokenTransfer })}
						<EntityView
							entityType={EntityType.TezosTokenTransfer}
							entitySelector={tezosTokenTransfer[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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
				<EntitiesList
					entityType={EntityType.TezosBigMap}
					collapsible={false}
					title={label}
					emptyText='No Tezos big maps.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$bigMaps()}
				>
					{#snippet Item({ item: tezosBigMap })}
						<EntityView
							entityType={EntityType.TezosBigMap}
							entitySelector={tezosBigMap[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosBigMapKeys({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosBigMapKey}
					collapsible={false}
					title={label}
					emptyText='No Tezos big map keys.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$bigMapKeys()}
				>
					{#snippet Item({ item: tezosBigMapKey })}
						<EntityView
							entityType={EntityType.TezosBigMapKey}
							entitySelector={tezosBigMapKey[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosBigMapObservations({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosBigMap_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No Tezos big map observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$bigMapTimestamps()}
				>
					{#snippet Item({ item: tezosBigMapTimestamp })}
						<EntityView
							entityType={EntityType.TezosBigMap_Timestamp}
							entitySelector={tezosBigMapTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosBigMapKeyObservations({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosBigMapKey_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No Tezos big map key observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$bigMapKeyTimestamps()}
				>
					{#snippet Item({ item: tezosBigMapKeyTimestamp })}
						<EntityView
							entityType={EntityType.TezosBigMapKey_Timestamp}
							entitySelector={tezosBigMapKeyTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
