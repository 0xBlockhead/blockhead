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
	}: EntitySelectionViewProps<EntityType.Erc4626Vault_Block> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.SqdPortal_RawHttp,
			Source.Voltaire_JsonRpc,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Erc4626VaultView from '$/views/Erc4626VaultView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4626Vault_Block}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.blockNumber)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.blockNumber}
		/>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.source || String(selection.entitySelector.blockNumber)}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Vault</dt>
				<dd>
					<Erc4626VaultView
						selection={select(EntityType.Erc4626Vault, selection.entitySelector.$vault)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.blockNumber}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalAssets: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalAssets = entity.totalAssets}
					{#if totalAssets != null}
						<div>
							<dt>Total assets</dt>
							<dd>
								<NumberValue
									value={totalAssets}
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
								<NumberValue
									value={totalSupply}
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
							assetsPerShare: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetsPerShare = entity.assetsPerShare}
					{#if assetsPerShare != null}
						<div>
							<dt>Assets per share</dt>
							<dd>
								<NumberValue
									value={assetsPerShare}
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
							sharesPerAsset: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sharesPerAsset = entity.sharesPerAsset}
					{#if sharesPerAsset != null}
						<div>
							<dt>Shares per asset</dt>
							<dd>
								<NumberValue
									value={sharesPerAsset}
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
							maxDepositAssets: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxDepositAssets = entity.maxDepositAssets}
					{#if maxDepositAssets != null}
						<div>
							<dt>Max deposit assets</dt>
							<dd>
								<NumberValue
									value={maxDepositAssets}
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
							maxMintShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxMintShares = entity.maxMintShares}
					{#if maxMintShares != null}
						<div>
							<dt>Max mint shares</dt>
							<dd>
								<NumberValue
									value={maxMintShares}
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
							maxWithdrawAssets: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxWithdrawAssets = entity.maxWithdrawAssets}
					{#if maxWithdrawAssets != null}
						<div>
							<dt>Max withdraw assets</dt>
							<dd>
								<NumberValue
									value={maxWithdrawAssets}
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
							maxRedeemShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxRedeemShares = entity.maxRedeemShares}
					{#if maxRedeemShares != null}
						<div>
							<dt>Max redeem shares</dt>
							<dd>
								<NumberValue
									value={maxRedeemShares}
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
							previewDepositShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previewDepositShares = entity.previewDepositShares}
					{#if previewDepositShares != null}
						<div>
							<dt>Preview deposit shares</dt>
							<dd>
								<NumberValue
									value={previewDepositShares}
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
							previewMintAssets: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previewMintAssets = entity.previewMintAssets}
					{#if previewMintAssets != null}
						<div>
							<dt>Preview mint assets</dt>
							<dd>
								<NumberValue
									value={previewMintAssets}
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
							previewWithdrawShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previewWithdrawShares = entity.previewWithdrawShares}
					{#if previewWithdrawShares != null}
						<div>
							<dt>Preview withdraw shares</dt>
							<dd>
								<NumberValue
									value={previewWithdrawShares}
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
							previewRedeemAssets: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previewRedeemAssets = entity.previewRedeemAssets}
					{#if previewRedeemAssets != null}
						<div>
							<dt>Preview redeem assets</dt>
							<dd>
								<NumberValue
									value={previewRedeemAssets}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
