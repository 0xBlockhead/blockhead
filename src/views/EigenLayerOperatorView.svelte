<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.EigenLayerOperator> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const eigenLayerOperator = $derived(viewSelection({
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.operatorAddress || 'eigen layer operator')
	const viewDomId = $derived('eigen-layer-operator-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EigenLayerDelegation_TimestampsView from '$/views/EigenLayerDelegation_TimestampsView.svelte'
	import EigenLayerAllocation_TimestampsView from '$/views/EigenLayerAllocation_TimestampsView.svelte'
	import EigenLayerReward_TimestampsView from '$/views/EigenLayerReward_TimestampsView.svelte'
	import EigenLayerSlashingEventsView from '$/views/EigenLayerSlashingEventsView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerOperator}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={eigenLayerOperator}>
			{#snippet children(entity)}
				{(entity.name ?? '') || selection.entitySelector.operatorAddress || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>operator address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.operatorAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={eigenLayerOperator}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							website: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const website = entity.website}
					{#if website != null}
						<div>
							<dt>website</dt>
							<dd>
								<a
									href={website}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={website} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							metadataUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadataUri = entity.metadataUri}
					{#if metadataUri != null}
						<div>
							<dt>metadata URI</dt>
							<dd>
								<a
									href={metadataUri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={metadataUri} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							earningsReceiver: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const earningsReceiver = entity.earningsReceiver}
					{#if earningsReceiver != null}
						<div>
							<dt>earnings receiver</dt>
							<dd>
								{earningsReceiver}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							delegationApprover: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegationApprover = entity.delegationApprover}
					{#if delegationApprover != null}
						<div>
							<dt>delegation approver</dt>
							<dd>
								{delegationApprover}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							stakerOptOutWindowBlocks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakerOptOutWindowBlocks = entity.stakerOptOutWindowBlocks}
					{#if stakerOptOutWindowBlocks != null}
						<div>
							<dt>staker opt out window blocks</dt>
							<dd>
								<NumberValue
									value={stakerOptOutWindowBlocks}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$operatorAccount}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null}
						<div>
							<dt>operator account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									prefetched={evmNetworkAccount}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-eigenlayer-operator-stake'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'eigenlayer-operator-delegations',
						label: 'Delegations',
					},
					{
						id: 'eigenlayer-operator-allocations',
						label: 'Allocations',
					},
				]
			}
			data-card
			class='network-view-collapsible-stake'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Stake</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEigenlayerOperatorDelegations({ id, label })}
				<EigenLayerDelegation_TimestampsView
					selection={selection.$$delegations}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer delegation observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEigenlayerOperatorAllocations({ id, label })}
				<EigenLayerAllocation_TimestampsView
					selection={selection.$$allocations}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer allocation observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-eigenlayer-operator-economics'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'eigenlayer-operator-rewards',
						label: 'Rewards',
					},
					{
						id: 'eigenlayer-operator-slashing',
						label: 'Slashing events',
					},
				]
			}
			data-card
			class='network-view-collapsible-economics'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Rewards and slashing</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEigenlayerOperatorRewards({ id, label })}
				<EigenLayerReward_TimestampsView
					selection={selection.$$rewards}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer reward observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEigenlayerOperatorSlashing({ id, label })}
				<EigenLayerSlashingEventsView
					selection={selection.$$slashingEvents}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer slashing events.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
