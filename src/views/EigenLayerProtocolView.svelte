<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.EigenLayerProtocol> = $props()

	const network = $derived(selection.entitySelector.$network)
	const eigenLayerProtocol = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			protocolName: true,
		},
	}))
	const titleFallback = $derived((prefetched.protocolName ?? '') || 'eigen layer protocol')
	const viewDomId = $derived('eigen-layer-protocol-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EigenLayerOperatorsView from '$/views/EigenLayerOperatorsView.svelte'
	import EigenLayerAVSsView from '$/views/EigenLayerAVSsView.svelte'
	import EigenLayerStrategiesView from '$/views/EigenLayerStrategiesView.svelte'
	import EigenLayerReward_TimestampsView from '$/views/EigenLayerReward_TimestampsView.svelte'
	import EigenLayerSlashingEventsView from '$/views/EigenLayerSlashingEventsView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerProtocol}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={eigenLayerProtocol}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Value}
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

			<div>
				<dt>protocol name</dt>
				<dd>
					<ResourceBoundary
						resource={eigenLayerProtocol}
					>
						{#snippet children(entity)}
							{entity.protocolName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$delegationManager}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>delegation manager</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$strategyManager}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>strategy manager</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$avsDirectory}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>AVS directory</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$allocationManager}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>allocation manager</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$rewardsCoordinator}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>rewards coordinator</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$slasher}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>slasher</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
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
			id={viewDomId + '-carousel-eigenlayer-directory'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'eigenlayer-operators',
						label: 'Operators',
					},
					{
						id: 'eigenlayer-avss',
						label: 'AVSs',
					},
					{
						id: 'eigenlayer-strategies',
						label: 'Strategies',
					},
				]
			}
			data-card
			class='network-view-collapsible-directory'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Directory</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEigenlayerOperators({ id, label })}
				<EigenLayerOperatorsView
					selection={
						selection
						.$$operators({
							sources: [
								Source.EigenExplorer_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer operators.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEigenlayerAvss({ id, label })}
				<EigenLayerAVSsView
					selection={
						selection
						.$$avss({
							sources: [
								Source.EigenExplorer_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer AVSs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEigenlayerStrategies({ id, label })}
				<EigenLayerStrategiesView
					selection={
						selection
						.$$strategies({
							sources: [
								Source.EigenExplorer_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer strategies.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-eigenlayer-economics'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'eigenlayer-rewards',
						label: 'Rewards',
					},
					{
						id: 'eigenlayer-slashing',
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

			{#snippet SectionEigenlayerRewards({ id, label })}
				<EigenLayerReward_TimestampsView
					selection={selection.$$rewards}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer reward observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEigenlayerSlashing({ id, label })}
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
