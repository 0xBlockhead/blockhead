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

	const scalingDeploymentClaim = $derived(selection({
		fields: {
			scalingDeploymentClaimId: true,
		},
	}))
	const titleFallback = $derived([selection.entitySelector.sourceProjectId, (prefetched.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim')


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
				{[selection.entitySelector.sourceProjectId, (entity.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={scalingDeploymentClaim}>
			{#snippet children(entity)}
				{[selection.entitySelector.sourceProjectId, (entity.scalingDeploymentClaimId ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
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
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Source project ID</dt>
				<dd>
					{selection.entitySelector.sourceProjectId}
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
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ScalingDeploymentClaim_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const settlementContractsResource = selection.$$settlementContracts}
		<ResourceBoundary
			resource={settlementContractsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmContractsView
						selection={settlementContractsResource}
						countResource={settlementContractsResource.count}
						title='Settlement contracts'
						id='settlement-contracts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
