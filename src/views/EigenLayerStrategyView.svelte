<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EigenLayerStrategy>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.EigenExplorer_Rest,
		],
	}))
	const eigenLayerStrategy = $derived(viewSelection({
		fields: {
			underlyingToken: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.strategyAddress || 'eigen layer strategy')
	const viewDomId = $derived('eigen-layer-strategy-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EigenLayerStrategy_TimestampsView from '$/views/EigenLayerStrategy_TimestampsView.svelte'
	import EigenLayerDelegation_TimestampsView from '$/views/EigenLayerDelegation_TimestampsView.svelte'
	import EigenLayerAllocation_TimestampsView from '$/views/EigenLayerAllocation_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerStrategy}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/strategy/[strategyAddress=evmAddress]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					strategyAddress: selection.entitySelector.strategyAddress,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={eigenLayerStrategy}>
			{#snippet children(entity)}
				{(entity.underlyingToken ?? '') || selection.entitySelector.strategyAddress || titleFallback}
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
				<dt>strategy address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.strategyAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={eigenLayerStrategy}
			>
				{#snippet children(entity)}
					{@const underlyingToken = entity.underlyingToken}
					{#if underlyingToken != null}
						<div>
							<dt>underlying token</dt>
							<dd>
								{underlyingToken}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$underlyingCoin}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						{@const evmCoinInstanceInitial = untrack(() => evmCoinInstance)}
						<div>
							<dt>underlying coin</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, (evmCoinInstance ?? evmCoinInstanceInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							strategyKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const strategyKind = entity.strategyKind}
					{#if strategyKind != null}
						<div>
							<dt>strategy kind</dt>
							<dd>
								{strategyKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

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
				resource={selection.$strategyContract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						{@const evmContractInitial = untrack(() => evmContract)}
						<div>
							<dt>strategy contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
									prefetched={evmContract ?? evmContractInitial}
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
			id={viewDomId + '-carousel-eigenlayer-strategy-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'eigenlayer-strategy-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEigenlayerStrategyTimestamps({ id, label })}
				<EigenLayerStrategy_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer strategy observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-eigenlayer-strategy-stake'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'eigenlayer-strategy-delegations',
						label: 'Delegations',
					},
					{
						id: 'eigenlayer-strategy-allocations',
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

			{#snippet SectionEigenlayerStrategyDelegations({ id, label })}
				<EigenLayerDelegation_TimestampsView
					selection={selection.$$delegations}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer delegation observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEigenlayerStrategyAllocations({ id, label })}
				<EigenLayerAllocation_TimestampsView
					selection={selection.$$allocations}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer allocation observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
