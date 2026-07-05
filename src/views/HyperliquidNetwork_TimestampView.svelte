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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HyperliquidNetwork_Timestamp>>
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
	const hyperliquidNetworkTimestamp = $derived(selection({}))
	const titleFallback = $derived('hyperliquid network timestamp')
	const viewDomId = $derived('hyperliquid-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hyperliquidNetworkTimestamp}>
			{#snippet Pending()}
				{title || 'hyperliquid network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
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
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							perpMarketCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const perpMarketCount = prefetched.perpMarketCount}
					{#if perpMarketCount !== undefined && perpMarketCount !== null}
						<div>
							<dt>perp market count</dt>
							<dd>
								{String((perpMarketCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const perpMarketCount = resolvedEntity.perpMarketCount}
					{#if perpMarketCount !== undefined && perpMarketCount !== null}
						<div>
							<dt>perp market count</dt>
							<dd>
								{String((perpMarketCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spotAssetCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const spotAssetCount = prefetched.spotAssetCount}
					{#if spotAssetCount !== undefined && spotAssetCount !== null}
						<div>
							<dt>spot asset count</dt>
							<dd>
								{String((spotAssetCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spotAssetCount = resolvedEntity.spotAssetCount}
					{#if spotAssetCount !== undefined && spotAssetCount !== null}
						<div>
							<dt>spot asset count</dt>
							<dd>
								{String((spotAssetCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spotPairCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const spotPairCount = prefetched.spotPairCount}
					{#if spotPairCount !== undefined && spotPairCount !== null}
						<div>
							<dt>spot pair count</dt>
							<dd>
								{String((spotPairCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spotPairCount = resolvedEntity.spotPairCount}
					{#if spotPairCount !== undefined && spotPairCount !== null}
						<div>
							<dt>spot pair count</dt>
							<dd>
								{String((spotPairCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validatorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const validatorCount = prefetched.validatorCount}
					{#if validatorCount !== undefined && validatorCount !== null}
						<div>
							<dt>validator count</dt>
							<dd>
								{String((validatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validatorCount = resolvedEntity.validatorCount}
					{#if validatorCount !== undefined && validatorCount !== null}
						<div>
							<dt>validator count</dt>
							<dd>
								{String((validatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activeValidatorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activeValidatorCount = prefetched.activeValidatorCount}
					{#if activeValidatorCount !== undefined && activeValidatorCount !== null}
						<div>
							<dt>active validator count</dt>
							<dd>
								{String((activeValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeValidatorCount = resolvedEntity.activeValidatorCount}
					{#if activeValidatorCount !== undefined && activeValidatorCount !== null}
						<div>
							<dt>active validator count</dt>
							<dd>
								{String((activeValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							jailedValidatorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const jailedValidatorCount = prefetched.jailedValidatorCount}
					{#if jailedValidatorCount !== undefined && jailedValidatorCount !== null}
						<div>
							<dt>jailed validator count</dt>
							<dd>
								{String((jailedValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const jailedValidatorCount = resolvedEntity.jailedValidatorCount}
					{#if jailedValidatorCount !== undefined && jailedValidatorCount !== null}
						<div>
							<dt>jailed validator count</dt>
							<dd>
								{String((jailedValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalStake: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalStake = prefetched.totalStake}
					{#if totalStake !== undefined && totalStake !== null}
						<div>
							<dt>total stake</dt>
							<dd>
								{String((totalStake) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalStake = resolvedEntity.totalStake}
					{#if totalStake !== undefined && totalStake !== null}
						<div>
							<dt>total stake</dt>
							<dd>
								{String((totalStake) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							borrowLendReserveCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const borrowLendReserveCount = prefetched.borrowLendReserveCount}
					{#if borrowLendReserveCount !== undefined && borrowLendReserveCount !== null}
						<div>
							<dt>borrow lend reserve count</dt>
							<dd>
								{String((borrowLendReserveCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const borrowLendReserveCount = resolvedEntity.borrowLendReserveCount}
					{#if borrowLendReserveCount !== undefined && borrowLendReserveCount !== null}
						<div>
							<dt>borrow lend reserve count</dt>
							<dd>
								{String((borrowLendReserveCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							vaultCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const vaultCount = prefetched.vaultCount}
					{#if vaultCount !== undefined && vaultCount !== null}
						<div>
							<dt>vault count</dt>
							<dd>
								{String((vaultCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const vaultCount = resolvedEntity.vaultCount}
					{#if vaultCount !== undefined && vaultCount !== null}
						<div>
							<dt>vault count</dt>
							<dd>
								{String((vaultCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
