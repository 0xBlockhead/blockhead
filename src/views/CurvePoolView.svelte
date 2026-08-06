<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.CurvePool> = $props()

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
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CurvePool}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
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
				resource={
					viewSelection({
						fields: {
							gaugeAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gaugeAddress = entity.gaugeAddress}
					{#if gaugeAddress != null}
						<div>
							<dt>Gauge address</dt>
							<dd>
								<TruncatedValue value={gaugeAddress} />
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
							creationTs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const creationTs = entity.creationTs}
					{#if creationTs != null}
						<div>
							<dt>Creation timestamp</dt>
							<dd>
								<Timestamp timestamp={creationTs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
