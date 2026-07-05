<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
	const titleFallback = $derived([String((selection.entitySelector.sourceProjectId ?? prefetched.sourceProjectId) ?? ''), String((prefetched.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim')
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
				{[String((selection.entitySelector.sourceProjectId ?? prefetched.sourceProjectId) ?? ''), String((prefetched.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || title || 'scaling deployment claim'}
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
				{[String((selection.entitySelector.sourceProjectId ?? prefetched.sourceProjectId) ?? ''), String((prefetched.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || title || 'scaling deployment claim'}
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
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}

				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
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
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
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
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
							{@const sourceProjectId = selection.entitySelector.sourceProjectId ?? prefetched.sourceProjectId}
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
					{@const scalingDeploymentClaimId = prefetched.scalingDeploymentClaimId}
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
				resource={selection[EntityProxyField]<EntityType.EvmRollup, false>('$rollup')}
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
										(({ ...evmRollup[EntityMetaKey.Selector], ...evmRollup }).$network !== undefined && ({ ...evmRollup[EntityMetaKey.Selector], ...evmRollup }).$network.caip2 !== undefined && ({ ...evmRollup[EntityMetaKey.Selector], ...evmRollup }).$network.caip2.namespace !== undefined && ({ ...evmRollup[EntityMetaKey.Selector], ...evmRollup }).$network !== undefined && ({ ...evmRollup[EntityMetaKey.Selector], ...evmRollup }).$network.caip2 !== undefined && ({ ...evmRollup[EntityMetaKey.Selector], ...evmRollup }).$network.caip2.reference !== undefined && ({ ...evmRollup[EntityMetaKey.Selector], ...evmRollup }).projectId !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]', {
											caip2: `${String(({ ...evmRollup[EntityMetaKey.Selector], ...evmRollup }).$network.caip2.namespace ?? '')}:${String(({ ...evmRollup[EntityMetaKey.Selector], ...evmRollup }).$network.caip2.reference ?? '')}`,
											projectId: String(({ ...evmRollup[EntityMetaKey.Selector], ...evmRollup }).projectId ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
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
				selection={selection[EntityProxyField]<EntityType.ScalingDeploymentClaim_Timestamp>('$$timestamps')}
				title='Timestamps'
				emptyText='No scaling deployment claim observations yet.'
				id='ScalingDeploymentClaim_TimestampsView-$$timestamps'
			/>

			<EvmContractsView
				selection={selection[EntityProxyField]<EntityType.EvmContract>('$$settlementContracts')}
				title='Settlement contracts'
				href={resolve('/(explore)/contracts')}
				emptyText='No settlement contracts yet.'
				id='EvmContractsView-$$settlementContracts'
			/>
		{/if}
	{/snippet}
</EntityView>
