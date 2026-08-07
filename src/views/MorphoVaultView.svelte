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
	}: EntitySelectionViewProps<EntityType.MorphoVault> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Morpho_Graphql,
		],
	}))
	const morphoVault = $derived(viewSelection({
		fields: {
			name: true,
			symbol: true,
			listed: true,
			apy: true,
			netApy: true,
			totalAssets: true,
			assetAddress: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), (prefetched.symbol ?? '')].filter(Boolean).join(' ') || 'Morpho vault')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.MorphoVault}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/morpho-vault/[vaultAddress=evmAddress]',
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
		<ResourceBoundary resource={morphoVault}>
			{#snippet children(entity)}
				{[entity.name, entity.symbol].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={morphoVault}>
			{#snippet children(entity)}
				{[String(entity.listed), String(entity.apy ?? ''), String(entity.netApy ?? ''), (entity.totalAssets ?? ''), entity.assetAddress].filter(Boolean).join(' ') || [entity.name, entity.symbol].filter(Boolean).join(' ') || titleFallback}
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
						resource={morphoVault}
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
						resource={morphoVault}
					>
						{#snippet children(entity)}
							{entity.symbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Listed</dt>
				<dd>
					<ResourceBoundary
						resource={morphoVault}
					>
						{#snippet children(entity)}
							{entity.listed ? 'Yes' : 'No'}
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
						resource={morphoVault}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.assetAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Asset decimals</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									assetDecimals: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.assetDecimals}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={morphoVault}
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
				resource={
					viewSelection({
						fields: {
							totalAssetsUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalAssetsUsd = entity.totalAssetsUsd}
					{#if totalAssetsUsd != null}
						<div>
							<dt>Total assets (USD)</dt>
							<dd>
								{totalAssetsUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={morphoVault}
			>
				{#snippet children(entity)}
					{@const apy = entity.apy}
					{#if apy != null}
						<div>
							<dt>APY</dt>
							<dd>
								{apy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={morphoVault}
			>
				{#snippet children(entity)}
					{@const netApy = entity.netApy}
					{#if netApy != null}
						<div>
							<dt>Net APY</dt>
							<dd>
								{netApy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fee = entity.fee}
					{#if fee != null}
						<div>
							<dt>Fee</dt>
							<dd>
								{fee}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sharePriceUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sharePriceUsd = entity.sharePriceUsd}
					{#if sharePriceUsd != null}
						<div>
							<dt>Share price (USD)</dt>
							<dd>
								{sharePriceUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastIndexedBlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastIndexedBlock = entity.lastIndexedBlock}
					{#if lastIndexedBlock != null}
						<div>
							<dt>Last indexed block</dt>
							<dd>
								{lastIndexedBlock}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastAccrualTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastAccrualTimestamp = entity.lastAccrualTimestamp}
					{#if lastAccrualTimestamp != null}
						<div>
							<dt>Last accrual</dt>
							<dd>
								<Timestamp timestamp={lastAccrualTimestamp} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
