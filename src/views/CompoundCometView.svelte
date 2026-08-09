<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.CompoundComet> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Compound_Rest,
		],
	}))
	const compoundComet = $derived(viewSelection({
		fields: {
			name: true,
			baseTokenSymbol: true,
			collateralAssetCount: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || 'Compound Comet market')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CompoundCometAssetsView from '$/views/CompoundCometAssetsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CompoundComet}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/compound-comet/[cometAddress=evmAddress]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					cometAddress: selection.entitySelector.cometAddress,
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
		<ResourceBoundary resource={compoundComet}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={compoundComet}>
			{#snippet children(entity)}
				{[entity.baseTokenSymbol, String(entity.collateralAssetCount)].filter(Boolean).join(' ') || entity.name || titleFallback}
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
				<dt>Comet address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.cometAddress} />
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={compoundComet}
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
						resource={
							viewSelection({
								fields: {
									symbol: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.symbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Market slug</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									marketSlug: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.marketSlug}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Base token symbol</dt>
				<dd>
					<ResourceBoundary
						resource={compoundComet}
					>
						{#snippet children(entity)}
							{entity.baseTokenSymbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Base token address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									baseTokenAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.baseTokenAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Base token price feed address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									baseTokenPriceFeedAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.baseTokenPriceFeedAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Collateral asset count</dt>
				<dd>
					<ResourceBoundary
						resource={compoundComet}
					>
						{#snippet children(entity)}
							{entity.collateralAssetCount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowMin: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowMin = entity.borrowMin}
					{#if borrowMin != null}
						<div>
							<dt>Minimum borrow</dt>
							<dd>
								{borrowMin}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							targetReserves: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const targetReserves = entity.targetReserves}
					{#if targetReserves != null}
						<div>
							<dt>Target reserves</dt>
							<dd>
								{targetReserves}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							governorAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const governorAddress = entity.governorAddress}
					{#if governorAddress != null}
						<div>
							<dt>Governor address</dt>
							<dd>
								<TruncatedValue value={governorAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							pauseGuardianAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pauseGuardianAddress = entity.pauseGuardianAddress}
					{#if pauseGuardianAddress != null}
						<div>
							<dt>Pause guardian address</dt>
							<dd>
								<TruncatedValue value={pauseGuardianAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							configuratorAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const configuratorAddress = entity.configuratorAddress}
					{#if configuratorAddress != null}
						<div>
							<dt>Configurator address</dt>
							<dd>
								<TruncatedValue value={configuratorAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							rewardsAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardsAddress = entity.rewardsAddress}
					{#if rewardsAddress != null}
						<div>
							<dt>Rewards address</dt>
							<dd>
								<TruncatedValue value={rewardsAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							bulkerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bulkerAddress = entity.bulkerAddress}
					{#if bulkerAddress != null}
						<div>
							<dt>Bulker address</dt>
							<dd>
								<TruncatedValue value={bulkerAddress} />
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
							supplyKink: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supplyKink = entity.supplyKink}
					{#if supplyKink != null}
						<div>
							<dt>Supply kink</dt>
							<dd>
								{supplyKink}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							supplySlopeLow: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supplySlopeLow = entity.supplySlopeLow}
					{#if supplySlopeLow != null}
						<div>
							<dt>Supply slope low</dt>
							<dd>
								{supplySlopeLow}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							supplySlopeHigh: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supplySlopeHigh = entity.supplySlopeHigh}
					{#if supplySlopeHigh != null}
						<div>
							<dt>Supply slope high</dt>
							<dd>
								{supplySlopeHigh}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							supplyBase: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supplyBase = entity.supplyBase}
					{#if supplyBase != null}
						<div>
							<dt>Supply base</dt>
							<dd>
								{supplyBase}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowKink: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowKink = entity.borrowKink}
					{#if borrowKink != null}
						<div>
							<dt>Borrow kink</dt>
							<dd>
								{borrowKink}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowSlopeLow: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowSlopeLow = entity.borrowSlopeLow}
					{#if borrowSlopeLow != null}
						<div>
							<dt>Borrow slope low</dt>
							<dd>
								{borrowSlopeLow}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowSlopeHigh: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowSlopeHigh = entity.borrowSlopeHigh}
					{#if borrowSlopeHigh != null}
						<div>
							<dt>Borrow slope high</dt>
							<dd>
								{borrowSlopeHigh}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowBase: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowBase = entity.borrowBase}
					{#if borrowBase != null}
						<div>
							<dt>Borrow base</dt>
							<dd>
								{borrowBase}
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
							utilization: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const utilization = entity.utilization}
					{#if utilization != null}
						<div>
							<dt>Utilization</dt>
							<dd>
								{utilization}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							supplyApy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supplyApy = entity.supplyApy}
					{#if supplyApy != null}
						<div>
							<dt>Supply APY</dt>
							<dd>
								{supplyApy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowApy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowApy = entity.borrowApy}
					{#if borrowApy != null}
						<div>
							<dt>Borrow APY</dt>
							<dd>
								{borrowApy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const assetsResource = selection.$$assets}
		<ResourceBoundary
			resource={assetsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CompoundCometAssetsView
						selection={assetsResource}
						countResource={assetsResource.count}
						title='Collateral assets'
						id='assets'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
