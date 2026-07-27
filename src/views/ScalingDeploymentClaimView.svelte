<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.ScalingDeploymentClaim> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const scalingDeploymentClaim = $derived(selection({
		fields: {
			scalingDeploymentClaimId: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.sourceProjectId ?? ''), (pendingEntity.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ScalingDeploymentClaim_TimestampsView from '$/views/ScalingDeploymentClaim_TimestampsView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<EntityView
	entityType={EntityType.ScalingDeploymentClaim}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={scalingDeploymentClaim}>
			{#snippet children(entity)}
				{[pendingEntity.sourceProjectId, (entity.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={scalingDeploymentClaim}>
			{#snippet children(entity)}
				{[pendingEntity.sourceProjectId, (entity.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{pendingEntity.source}
		</span>

		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
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
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<div>
				<dt>Source project ID</dt>
				<dd>
					{pendingEntity.sourceProjectId}
				</dd>
			</div>

			<ResourceBoundary
				resource={scalingDeploymentClaim}
			>
				{#snippet children(entity)}
					{@const scalingDeploymentClaimId = entity.scalingDeploymentClaimId}
					{#if scalingDeploymentClaimId != null}
						<div>
							<dt>Scaling deployment claim ID</dt>
							<dd>
								{scalingDeploymentClaimId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$rollup}
			>
				{#snippet children(evmRollup)}
					{#if evmRollup != null}
						<div>
							<dt>Rollup</dt>
							<dd>
								<EvmRollupView
									selection={select(EntityType.EvmRollup, evmRollup[EntityMetaKey.Selector])}
									prefetched={evmRollup}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const scalingDeploymentClaimScalingDeploymentClaimTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={scalingDeploymentClaimScalingDeploymentClaimTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ScalingDeploymentClaim_TimestampsView
						selection={scalingDeploymentClaimScalingDeploymentClaimTimestampsViewTimestampsResource}
						countResource={scalingDeploymentClaimScalingDeploymentClaimTimestampsViewTimestampsResource.count}
						title='Timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const scalingDeploymentClaimEvmContractsViewSettlementContractsResource = selection.$$settlementContracts}
		<ResourceBoundary
			resource={scalingDeploymentClaimEvmContractsViewSettlementContractsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmContractsView
						selection={scalingDeploymentClaimEvmContractsViewSettlementContractsResource}
						countResource={scalingDeploymentClaimEvmContractsViewSettlementContractsResource.count}
						title='Settlement contracts'
						id='settlement-contracts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
