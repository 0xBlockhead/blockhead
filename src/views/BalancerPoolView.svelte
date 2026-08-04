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
	}: EntitySelectionViewProps<EntityType.BalancerPool> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Balancer_Rest,
		],
	}))
	const balancerPool = $derived(viewSelection({
		fields: {
			name: true,
			poolType: true,
			totalLiquidity: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || 'Balancer pool')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BalancerPool}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={balancerPool}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={balancerPool}>
			{#snippet children(entity)}
				{[entity.poolType, (entity.totalLiquidity ?? '')].filter(Boolean).join(' ') || entity.name || titleFallback}
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
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.address} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Pool ID</dt>
				<dd>
					{selection.entitySelector.poolId}
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={balancerPool}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Pool type</dt>
				<dd>
					<ResourceBoundary
						resource={balancerPool}
					>
						{#snippet children(entity)}
							{entity.poolType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Version</dt>
				<dd>
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
							{entity.version}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Protocol version</dt>
				<dd>
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
							{entity.protocolVersion}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Vault address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									vaultAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.vaultAddress} />
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
							swapFee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const swapFee = entity.swapFee}
					{#if swapFee != null}
						<div>
							<dt>Swap fee</dt>
							<dd>
								{swapFee}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={balancerPool}
			>
				{#snippet children(entity)}
					{@const totalLiquidity = entity.totalLiquidity}
					{#if totalLiquidity != null}
						<div>
							<dt>Total liquidity</dt>
							<dd>
								{totalLiquidity}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalShares = entity.totalShares}
					{#if totalShares != null}
						<div>
							<dt>Total shares</dt>
							<dd>
								{totalShares}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
