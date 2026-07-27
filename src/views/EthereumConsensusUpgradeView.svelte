<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EthereumConsensusUpgrade> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const ethereumConsensusUpgrade = $derived(viewSelection({
		fields: {
			name: true,
			upgradeId: true,
			protocol: true,
			activationBlock: true,
			activationEpoch: true,
			activationTimestampMs: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.upgradeId ?? '') || (pendingEntity.name ?? '') || 'Ethereum consensus upgrade')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumConsensusUpgrade}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? (
			'slug' in selection.entitySelector ?
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/consensus/[upgradeSlug=stringSegment]',
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
		<ResourceBoundary resource={ethereumConsensusUpgrade}>
			{#snippet children(entity)}
				{entity.upgradeId || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ethereumConsensusUpgrade}>
			{#snippet children(entity)}
				{entity.upgradeId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={ethereumConsensusUpgrade}
			>
				{#snippet children(entity)}
					{@const protocol = entity.protocol}
					{#if protocol != null}
						<div>
							<dt>Consensus fork</dt>
							<dd>
								{protocol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ethereumConsensusUpgrade}
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
				resource={ethereumConsensusUpgrade}
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
				resource={ethereumConsensusUpgrade}
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
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								previousForkVersion: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const previousForkVersion = entity.previousForkVersion}
						{#if previousForkVersion != null}
							<div>
								<dt>Previous fork version</dt>
								<dd>
									<TruncatedValue value={previousForkVersion} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								currentForkVersion: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const currentForkVersion = entity.currentForkVersion}
						{#if currentForkVersion != null}
							<div>
								<dt>Current fork version</dt>
								<dd>
									<TruncatedValue value={currentForkVersion} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const ethereumConsensusUpgradeSpecificationProposalsViewProposalsResource = selection.$$proposals}
		<ResourceBoundary
			resource={ethereumConsensusUpgradeSpecificationProposalsViewProposalsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<SpecificationProposalsView
						selection={ethereumConsensusUpgradeSpecificationProposalsViewProposalsResource}
						countResource={ethereumConsensusUpgradeSpecificationProposalsViewProposalsResource.count}
						title='Specification proposals'
						id='proposals'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
