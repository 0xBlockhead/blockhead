<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.NetworkUpgrade> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const networkUpgrade = $derived(viewSelection({
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.name ?? ''), (pendingEntity.upgradeId ?? '')].filter(Boolean).join(' ') || 'network upgrade')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
	import NetworkUpgrade_TimestampsView from '$/views/NetworkUpgrade_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.NetworkUpgrade}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={networkUpgrade}>
			{#snippet children(entity)}
				{[entity.name, pendingEntity.upgradeId].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A generic network-upgrade compatibility row keyed by network and upgrade id. Rich Ethereum-specific upgrade modeling remains on EthereumNetworkUpgrade and related execution/consensus rows.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Upgrade ID</dt>
				<dd>
					{pendingEntity.upgradeId}
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={networkUpgrade}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const networkUpgradeSpecificationProposalsViewSpecificationProposalsResource = selection.$$specificationProposals}
		<ResourceBoundary
			resource={networkUpgradeSpecificationProposalsViewSpecificationProposalsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<SpecificationProposalsView
						selection={networkUpgradeSpecificationProposalsViewSpecificationProposalsResource}
						countResource={networkUpgradeSpecificationProposalsViewSpecificationProposalsResource.count}
						title='Specification proposals'
						id='specification-proposals'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const networkUpgradeNetworkUpgradeTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={networkUpgradeNetworkUpgradeTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NetworkUpgrade_TimestampsView
						selection={networkUpgradeNetworkUpgradeTimestampsViewTimestampsResource}
						countResource={networkUpgradeNetworkUpgradeTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
