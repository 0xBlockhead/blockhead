<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CardanoNetwork>>
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
	const cardanoNetwork = $derived(selection({}))
	const titleFallback = $derived('Cardano network')
	const viewDomId = $derived('cardano-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CardanoNetwork_TimestampsView from '$/views/CardanoNetwork_TimestampsView.svelte'
	import CardanoBlocksView from '$/views/CardanoBlocksView.svelte'
	import CardanoTransactionsView from '$/views/CardanoTransactionsView.svelte'
	import CardanoAddressesView from '$/views/CardanoAddressesView.svelte'
	import CardanoStakeCredentialsView from '$/views/CardanoStakeCredentialsView.svelte'
	import CardanoStakePoolsView from '$/views/CardanoStakePoolsView.svelte'
	import CardanoDRepsView from '$/views/CardanoDRepsView.svelte'
	import CardanoGovernanceProposalsView from '$/views/CardanoGovernanceProposalsView.svelte'
	import CardanoConstitution_EpochsView from '$/views/CardanoConstitution_EpochsView.svelte'
	import CardanoCommittee_EpochsView from '$/views/CardanoCommittee_EpochsView.svelte'
	import CardanoNativeAssetsView from '$/views/CardanoNativeAssetsView.svelte'
	import CardanoProtocolParameters_EpochsView from '$/views/CardanoProtocolParameters_EpochsView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoNetwork}>
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
		<ResourceBoundary resource={cardanoNetwork}>
			{#snippet Pending()}
				{[pendingEntity.$$timestamps.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')].filter(Boolean).join(' ') || title || 'Cardano network'}
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
				id={viewDomId + '-carousel-cardano-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'cardano-chain-observations',
							label: 'Observations',
						},
						{
							id: 'cardano-chain-blocks',
							label: 'Blocks',
						},
						{
							id: 'cardano-chain-transactions',
							label: 'Transactions',
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

				{#snippet SectionCardanoChainObservations({ id, label, open })}
					<CardanoNetwork_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoChainBlocks({ id, label, open })}
					<CardanoBlocksView
						selection={selection.$$blocks}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano blocks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoChainTransactions({ id, label, open })}
					<CardanoTransactionsView
						selection={selection.$$transactions}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-cardano-stake-delegation'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'cardano-stake-addresses',
							label: 'Addresses',
						},
						{
							id: 'cardano-stake-credentials',
							label: 'Stake credentials',
						},
						{
							id: 'cardano-stake-pools',
							label: 'Stake pools',
						},
					]
				}
				data-card
				class='network-view-collapsible-stake-delegation'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Stake and delegation</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCardanoStakeAddresses({ id, label, open })}
					<CardanoAddressesView
						selection={selection.$$addresses}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano addresses.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoStakeCredentials({ id, label, open })}
					<CardanoStakeCredentialsView
						selection={selection.$$stakeCredentials}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano stake credentials.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoStakePools({ id, label, open })}
					<CardanoStakePoolsView
						selection={selection.$$stakePools}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano stake pools.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-cardano-governance'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'cardano-governance-dreps',
							label: 'DReps',
						},
						{
							id: 'cardano-governance-proposals',
							label: 'Proposals',
						},
						{
							id: 'cardano-governance-constitution',
							label: 'Constitution epochs',
						},
						{
							id: 'cardano-governance-committee',
							label: 'Committee epochs',
						},
					]
				}
				data-card
				class='network-view-collapsible-governance'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Governance</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCardanoGovernanceDreps({ id, label, open })}
					<CardanoDRepsView
						selection={selection.$$dReps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano DReps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoGovernanceProposals({ id, label, open })}
					<CardanoGovernanceProposalsView
						selection={selection.$$governanceProposals}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano governance proposals.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoGovernanceConstitution({ id, label, open })}
					<CardanoConstitution_EpochsView
						selection={selection.$$constitutionEpochs}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano constitution epochs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoGovernanceCommittee({ id, label, open })}
					<CardanoCommittee_EpochsView
						selection={selection.$$committeeEpochs}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano committee epochs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-cardano-assets'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'cardano-assets-native',
							label: 'Native assets',
						},
					]
				}
				data-card
				class='network-view-collapsible-assets'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Assets</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCardanoAssetsNative({ id, label, open })}
					<CardanoNativeAssetsView
						selection={selection.$$assets}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano native assets.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-cardano-protocol-epochs'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'cardano-protocol-parameters',
							label: 'Protocol parameters',
						},
					]
				}
				data-card
				class='network-view-collapsible-protocol-epochs'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Protocol epochs</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCardanoProtocolParameters({ id, label, open })}
					<CardanoProtocolParameters_EpochsView
						selection={selection.$$protocolParameterEpochs}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Cardano protocol parameter epochs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
