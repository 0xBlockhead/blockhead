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
	}: EntitySelectionViewProps<EntityType.CompoundComet> = $props()

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
	import CompoundCometAssetsView from '$/views/CompoundCometAssetsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CompoundComet}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
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
