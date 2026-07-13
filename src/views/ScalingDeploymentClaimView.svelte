<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.ScalingDeploymentClaim>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ScalingDeploymentClaim>>
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
	const scalingDeploymentClaim = $derived(selection({
		fields: {
			scalingDeploymentClaimId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.sourceProjectId) ?? ''), String((pendingEntity.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim')
	const viewDomId = $derived('scaling-deployment-claim-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
			{#snippet Pending()}
				{[String((pendingEntity.sourceProjectId) ?? ''), String((pendingEntity.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || title || 'scaling deployment claim'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.sourceProjectId) ?? ''), String((resolvedEntity.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={scalingDeploymentClaim}>
			{#snippet Pending()}
				{[String((pendingEntity.sourceProjectId) ?? ''), String((pendingEntity.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || title || 'scaling deployment claim'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.sourceProjectId) ?? ''), String((resolvedEntity.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={scalingDeploymentClaim}>
			{#snippet Pending()}
				{@const source0 = pendingEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}

				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

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
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
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
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									sourceProjectId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const sourceProjectId = pendingEntity.sourceProjectId}
							{#if sourceProjectId !== undefined && sourceProjectId !== null}
								{String((sourceProjectId) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							scalingDeploymentClaimId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const scalingDeploymentClaimId = pendingEntity.scalingDeploymentClaimId}
					{#if scalingDeploymentClaimId !== undefined && scalingDeploymentClaimId !== null}
						<div>
							<dt>Scaling deployment claim ID</dt>
							<dd>
								{String((scalingDeploymentClaimId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(evmRollup)}
					{#if evmRollup != null && evmRollup[EntityMetaKey.Selector] != null}
						<div>
							<dt>Rollup</dt>
							<dd>
								<EvmRollupView
									selection={select(EntityType.EvmRollup, evmRollup[EntityMetaKey.Selector])}
									prefetched={evmRollup}
									href={
										(evmRollup[EntityMetaKey.Selector].$network !== undefined && evmRollup[EntityMetaKey.Selector].$network.slug !== undefined && evmRollup[EntityMetaKey.Selector].projectId !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
											network: String(evmRollup[EntityMetaKey.Selector].$network.slug ?? ''),
											projectId: String(evmRollup[EntityMetaKey.Selector].projectId ?? ''),
										}) : undefined)
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
		{#if detailsOpen}
			<ScalingDeploymentClaim_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Timestamps'
				emptyText='No scaling deployment claim observations yet.'
				id='ScalingDeploymentClaim_TimestampsView-timestamps'
			/>

			<EvmContractsView
				selection={
						selection.$$settlementContracts({
							count: true,
						})
					}
				title='Settlement contracts'
				href={resolve('/contracts')}
				emptyText='No settlement contracts yet.'
				id='EvmContractsView-settlement-contracts'
			/>
		{/if}
	{/snippet}
</EntityView>
