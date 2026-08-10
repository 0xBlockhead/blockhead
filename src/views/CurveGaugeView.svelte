<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
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
	}: EntitySelectionViewProps<EntityType.CurveGauge> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Curve_Rest,
		],
	}))
	const curveGauge = $derived(viewSelection({
		fields: {
			name: true,
			relativeWeight: true,
			gaugeCrvApyMin: true,
			gaugeCrvApyMax: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), selection.entitySelector.gaugeAddress].filter(Boolean).join(' ') || 'Curve gauge')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CurvePoolView from '$/views/CurvePoolView.svelte'
</script>


<EntityView
	entityType={EntityType.CurveGauge}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve/gauge/[gaugeAddress=evmAddress]',
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
		<ResourceBoundary resource={curveGauge}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), selection.entitySelector.gaugeAddress].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={curveGauge}>
			{#snippet children(entity)}
				{[(entity.relativeWeight ?? ''), String(entity.gaugeCrvApyMin ?? ''), String(entity.gaugeCrvApyMax ?? '')].filter(Boolean).join(' ') || [(entity.name ?? ''), selection.entitySelector.gaugeAddress].filter(Boolean).join(' ') || titleFallback}
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
			{#snippet children(curvePool)}
				{#if curvePool != null}
					{@const curvePoolInitial = untrack(() => curvePool)}
					<span data-text="muted">
						<CurvePoolView
							selection={select(EntityType.CurvePool, (curvePool ?? curvePoolInitial)[EntityMetaKey.Selector])}
							prefetched={curvePool ?? curvePoolInitial}
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
				{#snippet children(curvePool)}
					{#if curvePool != null}
						{@const curvePoolInitial = untrack(() => curvePool)}
						<div>
							<dt>Pool</dt>
							<dd>
								<CurvePoolView
									selection={select(EntityType.CurvePool, (curvePool ?? curvePoolInitial)[EntityMetaKey.Selector])}
									prefetched={curvePool ?? curvePoolInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={curveGauge}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
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
							isKilled: true,
						},
					})
				}
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
				resource={
					viewSelection({
						fields: {
							hasNoCrv: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hasNoCrv = entity.hasNoCrv}
					{#if hasNoCrv != null}
						<div>
							<dt>No CRV</dt>
							<dd>
								{hasNoCrv ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={curveGauge}
			>
				{#snippet children(entity)}
					{@const relativeWeight = entity.relativeWeight}
					{#if relativeWeight != null}
						<div>
							<dt>Relative weight</dt>
							<dd>
								{relativeWeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							workingSupply: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const workingSupply = entity.workingSupply}
					{#if workingSupply != null}
						<div>
							<dt>Working supply</dt>
							<dd>
								{workingSupply}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							inflationRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inflationRate = entity.inflationRate}
					{#if inflationRate != null}
						<div>
							<dt>Inflation rate</dt>
							<dd>
								{inflationRate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={curveGauge}
			>
				{#snippet children(entity)}
					{@const gaugeCrvApyMin = entity.gaugeCrvApyMin}
					{#if gaugeCrvApyMin != null}
						<div>
							<dt>CRV APY (min)</dt>
							<dd>
								<NumberValue
									value={gaugeCrvApyMin}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={curveGauge}
			>
				{#snippet children(entity)}
					{@const gaugeCrvApyMax = entity.gaugeCrvApyMax}
					{#if gaugeCrvApyMax != null}
						<div>
							<dt>CRV APY (max)</dt>
							<dd>
								<NumberValue
									value={gaugeCrvApyMax}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
