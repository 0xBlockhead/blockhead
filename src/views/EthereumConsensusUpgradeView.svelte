<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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

	const network = $derived(selection.entitySelector.$network)
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
	const titleFallback = $derived((prefetched.upgradeId ?? '') || (prefetched.name ?? '') || 'Ethereum consensus upgrade')


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
		href === undefined ?
			(
				selection.entitySelector.slug !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/consensus/[upgradeSlug=stringSegment]',
						{
							network: (
								network.caip2 !== undefined ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							upgradeSlug: selection.entitySelector.slug,
						}
					)
				:
					selection.entitySelector.upgradeId !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ethereum/consensus-upgrade/[upgradeId=stringSegment]',
							{
								network: (
									network.caip2 !== undefined ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								upgradeId: selection.entitySelector.upgradeId,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
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
								<Timestamp timestamp={activationTimestampMs} />
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

	{#snippet Details()}
		{@const proposalsResource = selection.$$proposals}
		<ResourceBoundary
			resource={proposalsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<SpecificationProposalsView
						selection={proposalsResource}
						countResource={proposalsResource.count}
						title='Specification proposals'
						id='proposals'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
