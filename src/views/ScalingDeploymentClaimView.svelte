<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ScalingDeploymentClaim> = $props()

	const network = $derived(selection.entitySelector.$network)
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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/scaling/[claimSource=stringSegment]/[sourceProjectId=stringSegment]',
				{
					network: (
						network.caip2 !== undefined ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					claimSource: selection.entitySelector.source,
					sourceProjectId: selection.entitySelector.sourceProjectId,
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
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
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
						{@const evmRollupInitial = untrack(() => evmRollup)}
						<div>
							<dt>Rollup</dt>
							<dd>
								<EvmRollupView
									selection={select(EntityType.EvmRollup, (evmRollup ?? evmRollupInitial)[EntityMetaKey.Selector])}
									prefetched={evmRollup ?? evmRollupInitial}
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
