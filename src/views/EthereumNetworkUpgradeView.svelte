<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.EthereumNetworkUpgrade> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const ethereumNetworkUpgrade = $derived(viewSelection({
		fields: {
			name: true,
			upgradeId: true,
			activationBlock: true,
			activationEpoch: true,
			activationTimestampMs: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.upgradeId ?? '') || (pendingEntity.name ?? '') || 'Ethereum network upgrade')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
	import EthereumExecutionUpgradeView from '$/views/EthereumExecutionUpgradeView.svelte'
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumNetworkUpgrade}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? (
			'slug' in selection.entitySelector ?
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/upgrade/[upgradeSlug=stringSegment]',
					{
						network: (
							'caip2' in selection.entitySelector.$network ?
								String(caip2StringFromValue(selection.entitySelector.$network.caip2))
							:
								String(selection.entitySelector.$network.slug)
						),
						upgradeSlug: String(selection.entitySelector.slug),
					}
				)
			:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ethereumNetworkUpgrade}>
			{#snippet children(entity)}
				{entity.upgradeId || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ethereumNetworkUpgrade}>
			{#snippet children(entity)}
				{entity.upgradeId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={ethereumNetworkUpgrade}
			>
				{#snippet children(entity)}
					{@const activationBlock = entity.activationBlock}
					{#if activationBlock != null}
						<div>
							<dt>Activation block</dt>
							<dd>
								<NumberValue
									value={activationBlock}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ethereumNetworkUpgrade}
			>
				{#snippet children(entity)}
					{@const activationEpoch = entity.activationEpoch}
					{#if activationEpoch != null}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue
									value={activationEpoch}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ethereumNetworkUpgrade}
			>
				{#snippet children(entity)}
					{@const activationTimestampMs = entity.activationTimestampMs}
					{#if activationTimestampMs != null}
						<div>
							<dt>Activation time</dt>
							<dd>
								<Timestamp timestamp={Number(activationTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<div>
					<dt>Execution layer</dt>
					<dd>
						<ResourceBoundary
							resource={selection.$networkExecutionUpgrade}
						>
							{#snippet children(ethereumExecutionUpgrade)}
								<EthereumExecutionUpgradeView
									selection={select(EntityType.EthereumExecutionUpgrade, ethereumExecutionUpgrade[EntityMetaKey.Selector])}
									prefetched={ethereumExecutionUpgrade}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$networkConsensusUpgrade}
				>
					{#snippet children(ethereumConsensusUpgrade)}
						{#if ethereumConsensusUpgrade != null}
							<div>
								<dt>Consensus layer</dt>
								<dd>
									<EthereumConsensusUpgradeView
										selection={select(EntityType.EthereumConsensusUpgrade, ethereumConsensusUpgrade[EntityMetaKey.Selector])}
										prefetched={ethereumConsensusUpgrade}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const ethereumNetworkUpgradeSpecificationProposalsViewProposalsResource = selection
		.$$proposals({
			sources: [
				Source.Constants_Internal,
			],
		})}
		<ResourceBoundary
			resource={ethereumNetworkUpgradeSpecificationProposalsViewProposalsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<SpecificationProposalsView
						selection={ethereumNetworkUpgradeSpecificationProposalsViewProposalsResource}
						countResource={ethereumNetworkUpgradeSpecificationProposalsViewProposalsResource.count}
						title='Specification proposals'
						id='proposals'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
