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
	}: EntitySelectionViewProps<EntityType.EulerEvkVault> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Euler_Rest,
		],
	}))
	const eulerEvkVault = $derived(viewSelection({
		fields: {
			name: true,
			symbol: true,
			totalAssets: true,
			utilization: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), (prefetched.symbol ?? '')].filter(Boolean).join(' ') || 'Euler EVK vault')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EulerEvkVault}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/euler/vault/[vaultAddress=evmAddress]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					vaultAddress: selection.entitySelector.vaultAddress,
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
		<ResourceBoundary resource={eulerEvkVault}>
			{#snippet children(entity)}
				{[entity.name, entity.symbol].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eulerEvkVault}>
			{#snippet children(entity)}
				{[(entity.totalAssets ?? ''), String(entity.utilization ?? '')].filter(Boolean).join(' ') || [entity.name, entity.symbol].filter(Boolean).join(' ') || titleFallback}
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
				<dt>Vault address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.vaultAddress} />
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={eulerEvkVault}
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
						resource={eulerEvkVault}
					>
						{#snippet children(entity)}
							{entity.symbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Decimals</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									decimals: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.decimals}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Asset address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									assetAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.assetAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Asset symbol</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									assetSymbol: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.assetSymbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={eulerEvkVault}
			>
				{#snippet children(entity)}
					{@const totalAssets = entity.totalAssets}
					{#if totalAssets != null}
						<div>
							<dt>Total assets</dt>
							<dd>
								{totalAssets}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalBorrows: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalBorrows = entity.totalBorrows}
					{#if totalBorrows != null}
						<div>
							<dt>Total borrows</dt>
							<dd>
								{totalBorrows}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={eulerEvkVault}
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
		</dl>

		<dl data-column-item="center">
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							supplyCap: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supplyCap = entity.supplyCap}
					{#if supplyCap != null}
						<div>
							<dt>Supply cap</dt>
							<dd>
								{supplyCap}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowCap: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowCap = entity.borrowCap}
					{#if borrowCap != null}
						<div>
							<dt>Borrow cap</dt>
							<dd>
								{borrowCap}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							interestFee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const interestFee = entity.interestFee}
					{#if interestFee != null}
						<div>
							<dt>Interest fee</dt>
							<dd>
								{interestFee}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							dTokenAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dTokenAddress = entity.dTokenAddress}
					{#if dTokenAddress != null}
						<div>
							<dt>Debt token address</dt>
							<dd>
								<TruncatedValue value={dTokenAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							oracleAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const oracleAddress = entity.oracleAddress}
					{#if oracleAddress != null}
						<div>
							<dt>Oracle address</dt>
							<dd>
								<TruncatedValue value={oracleAddress} />
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
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created at</dt>
							<dd>
								{createdAt}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							createdAtBlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAtBlock = entity.createdAtBlock}
					{#if createdAtBlock != null}
						<div>
							<dt>Created at block</dt>
							<dd>
								{createdAtBlock}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
