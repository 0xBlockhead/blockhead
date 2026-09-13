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
	}: EntitySelectionViewProps<EntityType.CurvePool> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Curve_Rest,
		],
	}))
	const curvePool = $derived(viewSelection({
		fields: {
			name: true,
			symbol: true,
			virtualPrice: true,
			usdTotal: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), (prefetched.symbol ?? '')].filter(Boolean).join(' ') || 'Curve pool')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CurvePoolCoinsView from '$/views/CurvePoolCoinsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CurveGaugeView from '$/views/CurveGaugeView.svelte'
</script>


<EntityView
	entityType={EntityType.CurvePool}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve-pool/[poolAddress=evmAddress]',
				{
					network: (
						network.caip2 !== undefined ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					poolAddress: selection.entitySelector.poolAddress,
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
		<ResourceBoundary resource={curvePool}>
			{#snippet children(entity)}
				{[entity.name, entity.symbol].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={curvePool}>
			{#snippet children(entity)}
				{[(entity.virtualPrice ?? ''), String(entity.usdTotal ?? '')].filter(Boolean).join(' ') || [entity.name, entity.symbol].filter(Boolean).join(' ') || titleFallback}
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
				<dt>Pool address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.poolAddress} />
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={curvePool}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={curvePool}
					>
						{#snippet children(entity)}
							{entity.symbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Registry ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									registryId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.registryId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>LP token address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									lpTokenAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.lpTokenAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={curvePool}
			>
				{#snippet children(entity)}
					{@const virtualPrice = entity.virtualPrice}
					{#if virtualPrice != null}
						<div>
							<dt>Virtual price</dt>
							<dd>
								{virtualPrice}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							amplificationCoefficient: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amplificationCoefficient = entity.amplificationCoefficient}
					{#if amplificationCoefficient != null}
						<div>
							<dt>Amplification coefficient</dt>
							<dd>
								{amplificationCoefficient}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalSupply: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalSupply = entity.totalSupply}
					{#if totalSupply != null}
						<div>
							<dt>Total supply</dt>
							<dd>
								{totalSupply}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={curvePool}
			>
				{#snippet children(entity)}
					{@const usdTotal = entity.usdTotal}
					{#if usdTotal != null}
						<div>
							<dt>Total value (USD)</dt>
							<dd>
								<NumberValue
									value={usdTotal}
								/>
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
							isMetaPool: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isMetaPool = entity.isMetaPool}
					{#if isMetaPool != null}
						<div>
							<dt>Is meta pool</dt>
							<dd>
								{isMetaPool ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							assetTypeName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetTypeName = entity.assetTypeName}
					{#if assetTypeName != null}
						<div>
							<dt>Asset type</dt>
							<dd>
								{assetTypeName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$gauge}
			>
				{#snippet children(curveGauge)}
					{#if curveGauge != null}
						{@const curveGaugeInitial = untrack(() => curveGauge)}
						<div>
							<dt>Gauge</dt>
							<dd>
								<CurveGaugeView
									selection={select(EntityType.CurveGauge, (curveGauge ?? curveGaugeInitial)[EntityMetaKey.Selector])}
									prefetched={curveGauge ?? curveGaugeInitial}
									layout={EntityLayout.Value}
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
							creationBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const creationBlockNumber = entity.creationBlockNumber}
					{#if creationBlockNumber != null}
						<div>
							<dt>Creation block number</dt>
							<dd>
								<NumberValue
									value={creationBlockNumber}
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
							creationTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const creationTimestampMs = entity.creationTimestampMs}
					{#if creationTimestampMs != null}
						<div>
							<dt>Creation timestamp</dt>
							<dd>
								<Timestamp timestamp={creationTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const coinsResource = selection.$$coins}
		<ResourceBoundary
			resource={coinsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CurvePoolCoinsView
						selection={coinsResource}
						countResource={coinsResource.count}
						title='Coins'
						id='coins'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
