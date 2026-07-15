<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.TezosNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.TezosNetwork>>
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
	const tezosNetwork = $derived(selection({}))
	const titleFallback = $derived('tezos network')
	const viewDomId = $derived('tezos-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosNetwork}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={tezosNetwork}>
			{#snippet Pending()}
				{[pendingEntity.$$timestamps.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')].filter(Boolean).join(' ') || title || 'tezos network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[resolvedEntity.$$timestamps.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Chain activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTezosChainObservations({ id, label, open })}
					<TezosNetwork_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosChainBlocks({ id, label, open })}
					<TezosBlocksView
						selection={
							selection.$$blocks({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos blocks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosChainOperationGroups({ id, label, open })}
					<TezosOperationGroupsView
						selection={
							selection.$$operationGroups({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos operation groups.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosChainOperations({ id, label, open })}
					<TezosOperationsView
						selection={
							selection.$$operations({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos operations.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Accounts and contracts</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTezosAccounts({ id, label, open })}
					<TezosAccountsView
						selection={
							selection.$$accounts({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos accounts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosContracts({ id, label, open })}
					<TezosContractsView
						selection={
							selection.$$contracts({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos contracts.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Bakers and cycles</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTezosBakers({ id, label, open })}
					<TezosBakersView
						selection={
							selection.$$bakers({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos bakers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosCycles({ id, label, open })}
					<TezosCyclesView
						selection={
							selection.$$cycles({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos cycles.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosBakingRights({ id, label, open })}
					<TezosBakingRightsView
						selection={
							selection.$$bakingRights({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos baking rights.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Tokens</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTezosTokenList({ id, label, open })}
					<TezosTokensView
						selection={
							selection.$$tokens({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos tokens.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosTokenTransfers({ id, label, open })}
					<TezosTokenTransfersView
						selection={
							selection.$$tokenTransfers({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos token transfers.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Big maps</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTezosBigMapList({ id, label, open })}
					<TezosBigMapsView
						selection={
							selection.$$bigMaps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos big maps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosBigMapKeys({ id, label, open })}
					<TezosBigMapKeysView
						selection={
							selection.$$bigMapKeys({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos big map keys.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosBigMapObservations({ id, label, open })}
					<TezosBigMap_TimestampsView
						selection={
							selection.$$bigMapTimestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos big map observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosBigMapKeyObservations({ id, label, open })}
					<TezosBigMapKey_TimestampsView
						selection={
							selection.$$bigMapKeyTimestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tezos big map key observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
