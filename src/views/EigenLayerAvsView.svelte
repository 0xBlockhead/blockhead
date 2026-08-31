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
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EigenLayerAvs>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.EigenExplorer_Rest,
		],
	}))
	const eigenLayerAvs = $derived(viewSelection({
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.avsAddress || 'eigen layer avs')
	const viewDomId = $derived('eigen-layer-avs-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EigenLayerOperatorsView from '$/views/EigenLayerOperatorsView.svelte'
	import EigenLayerAllocation_TimestampsView from '$/views/EigenLayerAllocation_TimestampsView.svelte'
	import EigenLayerAvs_TimestampsView from '$/views/EigenLayerAvs_TimestampsView.svelte'
	import EigenLayerSlashingEventsView from '$/views/EigenLayerSlashingEventsView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerAvs}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/avs/[avsAddress=evmAddress]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					avsAddress: selection.entitySelector.avsAddress,
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
		<ResourceBoundary resource={eigenLayerAvs}>
			{#snippet children(entity)}
				{(entity.name ?? '') || selection.entitySelector.avsAddress || titleFallback}
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
				<dt>AVS address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.avsAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={eigenLayerAvs}
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
				resource={selection.$avsAccount}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null}
						<div>
							<dt>AVS account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
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
			id={viewDomId + '-carousel-eigenlayer-avs-operators'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'eigenlayer-avs-operator-list',
						label: 'Operators',
					},
					{
						id: 'eigenlayer-avs-allocations',
						label: 'Allocations',
					},
				]
			}
			data-card
			class='network-view-collapsible-operators'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Operators and allocations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEigenlayerAvsOperatorList({ id, label })}
				<EigenLayerOperatorsView
					selection={selection.$$operators}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer operators.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEigenlayerAvsAllocations({ id, label })}
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
			id={viewDomId + '-carousel-eigenlayer-avs-security'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'eigenlayer-avs-observations',
						label: 'Observations',
					},
					{
						id: 'eigenlayer-avs-slashing',
						label: 'Slashing events',
					},
				]
			}
			data-card
			class='network-view-collapsible-security'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations and slashing</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEigenlayerAvsObservations({ id, label })}
				<EigenLayerAvs_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No EigenLayer AVS observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEigenlayerAvsSlashing({ id, label })}
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
