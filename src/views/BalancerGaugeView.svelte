<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.BalancerGauge> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Balancer_Rest,
		],
	}))
	const balancerGauge = $derived(viewSelection({
		fields: {
			poolSymbol: true,
			isKilled: true,
			relativeWeightCap: true,
		},
	}))
	const titleFallback = $derived([(prefetched.poolSymbol ?? ''), selection.entitySelector.gaugeAddress].filter(Boolean).join(' ') || 'Balancer gauge')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BalancerPoolView from '$/views/BalancerPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.BalancerGauge}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-gauge/[gaugeAddress=evmAddress]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					gaugeAddress: selection.entitySelector.gaugeAddress,
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
		<ResourceBoundary resource={balancerGauge}>
			{#snippet children(entity)}
				{[(entity.poolSymbol ?? ''), selection.entitySelector.gaugeAddress].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={balancerGauge}>
			{#snippet children(entity)}
				{[String(entity.isKilled ?? ''), (entity.relativeWeightCap ?? '')].filter(Boolean).join(' ') || [(entity.poolSymbol ?? ''), selection.entitySelector.gaugeAddress].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>

		<ResourceBoundary
			resource={selection.$pool}
		>
			{#snippet children(balancerPool)}
				{#if balancerPool != null}
					<span data-text="muted">
						<BalancerPoolView
							selection={select(EntityType.BalancerPool, balancerPool[EntityMetaKey.Selector])}
							prefetched={balancerPool}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
				<dt>Gauge address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.gaugeAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$pool}
			>
				{#snippet children(balancerPool)}
					{#if balancerPool != null}
						<div>
							<dt>Pool</dt>
							<dd>
								<BalancerPoolView
									selection={select(EntityType.BalancerPool, balancerPool[EntityMetaKey.Selector])}
									prefetched={balancerPool}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={balancerGauge}
			>
				{#snippet children(entity)}
					{@const poolSymbol = entity.poolSymbol}
					{#if poolSymbol != null}
						<div>
							<dt>Pool symbol</dt>
							<dd>
								{poolSymbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							poolType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const poolType = entity.poolType}
					{#if poolType != null}
						<div>
							<dt>Pool type</dt>
							<dd>
								{poolType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							protocolVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolVersion = entity.protocolVersion}
					{#if protocolVersion != null}
						<div>
							<dt>Protocol version</dt>
							<dd>
								<NumberValue
									value={protocolVersion}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>Version</dt>
							<dd>
								<NumberValue
									value={version}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={balancerGauge}
			>
				{#snippet children(entity)}
					{@const isKilled = entity.isKilled}
					{#if isKilled != null}
						<div>
							<dt>Killed</dt>
							<dd>
								{isKilled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={balancerGauge}
			>
				{#snippet children(entity)}
					{@const relativeWeightCap = entity.relativeWeightCap}
					{#if relativeWeightCap != null}
						<div>
							<dt>Relative weight cap</dt>
							<dd>
								{relativeWeightCap}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
