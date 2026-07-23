<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.ScalingDeploymentClaim>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.ScalingDeploymentClaim>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const scalingDeploymentClaim = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			scalingDeploymentClaimId: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			scalingDeploymentClaimId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.sourceProjectId) ?? ''), String((pendingEntity.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim')
	const viewDomId = $derived('scaling-deployment-claim-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ScalingDeploymentClaim_TimestampsView from '$/views/ScalingDeploymentClaim_TimestampsView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<EntityView
	entityType={EntityType.ScalingDeploymentClaim}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={scalingDeploymentClaim}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.sourceProjectId) ?? ''), String((resolvedEntity.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={scalingDeploymentClaim}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.sourceProjectId) ?? ''), String((resolvedEntity.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={scalingDeploymentClaim}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}

				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source project ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									sourceProjectId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sourceProjectId = resolvedEntity.sourceProjectId}
							{#if sourceProjectId !== undefined && sourceProjectId !== null}
								{String((sourceProjectId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							scalingDeploymentClaimId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const scalingDeploymentClaimId = resolvedEntity.scalingDeploymentClaimId}
					{#if scalingDeploymentClaimId !== undefined && scalingDeploymentClaimId !== null}
						<div>
							<dt>Scaling deployment claim ID</dt>
							<dd>
								{String((scalingDeploymentClaimId) ?? '')}
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
					{#if evmRollup != null && evmRollup[EntityMetaKey.Selector] != null}
						<div>
							<dt>Rollup</dt>
							<dd>
								<EvmRollupView
									selection={select(EntityType.EvmRollup, evmRollup[EntityMetaKey.Selector])}
									prefetched={evmRollup}
									href={
										(
											evmRollup[EntityMetaKey.Selector] != null && 'projectId' in evmRollup[EntityMetaKey.Selector]
											&& evmRollup[EntityMetaKey.Selector].projectId != null
											&& evmRollup[EntityMetaKey.Selector] != null && '$network' in evmRollup[EntityMetaKey.Selector] ?
												evmRollup[EntityMetaKey.Selector].$network != null && 'caip2' in evmRollup[EntityMetaKey.Selector].$network
												&& evmRollup[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
												projectId: String(evmRollup[EntityMetaKey.Selector].projectId ?? ''),
												network: String(caip2StringFromValue(evmRollup[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													evmRollup[EntityMetaKey.Selector].$network != null && 'slug' in evmRollup[EntityMetaKey.Selector].$network
													&& evmRollup[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
													projectId: String(evmRollup[EntityMetaKey.Selector].projectId ?? ''),
													network: String(evmRollup[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
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
					id='ScalingDeploymentClaim_TimestampsView-timestamps'
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
					id='EvmContractsView-settlement-contracts'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
