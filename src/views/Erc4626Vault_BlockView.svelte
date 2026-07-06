<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Erc4626Vault_Block>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Erc4626Vault_Block>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const erc4626VaultBlock = $derived(selection({
		sources: [
			Source.Voltaire_JsonRpc,
		],
	}))
	const titleFallback = $derived([String((selection.entitySelector.blockNumber ?? prefetched.blockNumber) ?? '')].filter(Boolean).join(' ') || 'erc4626 vault block')
	const viewDomId = $derived('erc4626vault-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Erc4626VaultView from '$/views/Erc4626VaultView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4626Vault_Block}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={erc4626VaultBlock}>
			{#snippet Pending()}
				{@const blockNumber0 = selection.entitySelector.blockNumber ?? prefetched.blockNumber}
				{#if blockNumber0 !== undefined && blockNumber0 !== null}
					<NumberValue value={Number(blockNumber0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const blockNumber0 = resolvedEntity.blockNumber}
				{#if blockNumber0 !== undefined && blockNumber0 !== null}
					<NumberValue value={Number(blockNumber0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={erc4626VaultBlock}>
			{#snippet Pending()}
				{[String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.blockNumber ?? prefetched.blockNumber) ?? '')].filter(Boolean).join(' ') || title || 'erc4626 vault block'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.blockNumber) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Vault</dt>
				<dd>
					<Erc4626VaultView
						selection={select(EntityType.Erc4626Vault, selection.entitySelector.$vault)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockNumber = selection.entitySelector.blockNumber ?? prefetched.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								<NumberValue value={Number(blockNumber)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockNumber = resolvedEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								<NumberValue value={Number(blockNumber)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalAssets: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalAssets = prefetched.totalAssets}
					{#if totalAssets !== undefined && totalAssets !== null}
						<div>
							<dt>Total assets</dt>
							<dd>
								<NumberValue value={Number(totalAssets)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalAssets = resolvedEntity.totalAssets}
					{#if totalAssets !== undefined && totalAssets !== null}
						<div>
							<dt>Total assets</dt>
							<dd>
								<NumberValue value={Number(totalAssets)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalSupply: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalSupply = prefetched.totalSupply}
					{#if totalSupply !== undefined && totalSupply !== null}
						<div>
							<dt>Total supply</dt>
							<dd>
								<NumberValue value={Number(totalSupply)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalSupply = resolvedEntity.totalSupply}
					{#if totalSupply !== undefined && totalSupply !== null}
						<div>
							<dt>Total supply</dt>
							<dd>
								<NumberValue value={Number(totalSupply)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetsPerShare: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetsPerShare = prefetched.assetsPerShare}
					{#if assetsPerShare !== undefined && assetsPerShare !== null}
						<div>
							<dt>Assets per share</dt>
							<dd>
								<NumberValue value={Number(assetsPerShare)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetsPerShare = resolvedEntity.assetsPerShare}
					{#if assetsPerShare !== undefined && assetsPerShare !== null}
						<div>
							<dt>Assets per share</dt>
							<dd>
								<NumberValue value={Number(assetsPerShare)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sharesPerAsset: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sharesPerAsset = prefetched.sharesPerAsset}
					{#if sharesPerAsset !== undefined && sharesPerAsset !== null}
						<div>
							<dt>Shares per asset</dt>
							<dd>
								<NumberValue value={Number(sharesPerAsset)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sharesPerAsset = resolvedEntity.sharesPerAsset}
					{#if sharesPerAsset !== undefined && sharesPerAsset !== null}
						<div>
							<dt>Shares per asset</dt>
							<dd>
								<NumberValue value={Number(sharesPerAsset)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxDepositAssets: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxDepositAssets = prefetched.maxDepositAssets}
					{#if maxDepositAssets !== undefined && maxDepositAssets !== null}
						<div>
							<dt>Max deposit assets</dt>
							<dd>
								<NumberValue value={Number(maxDepositAssets)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxDepositAssets = resolvedEntity.maxDepositAssets}
					{#if maxDepositAssets !== undefined && maxDepositAssets !== null}
						<div>
							<dt>Max deposit assets</dt>
							<dd>
								<NumberValue value={Number(maxDepositAssets)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxMintShares: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxMintShares = prefetched.maxMintShares}
					{#if maxMintShares !== undefined && maxMintShares !== null}
						<div>
							<dt>Max mint shares</dt>
							<dd>
								<NumberValue value={Number(maxMintShares)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxMintShares = resolvedEntity.maxMintShares}
					{#if maxMintShares !== undefined && maxMintShares !== null}
						<div>
							<dt>Max mint shares</dt>
							<dd>
								<NumberValue value={Number(maxMintShares)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxWithdrawAssets: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxWithdrawAssets = prefetched.maxWithdrawAssets}
					{#if maxWithdrawAssets !== undefined && maxWithdrawAssets !== null}
						<div>
							<dt>Max withdraw assets</dt>
							<dd>
								<NumberValue value={Number(maxWithdrawAssets)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxWithdrawAssets = resolvedEntity.maxWithdrawAssets}
					{#if maxWithdrawAssets !== undefined && maxWithdrawAssets !== null}
						<div>
							<dt>Max withdraw assets</dt>
							<dd>
								<NumberValue value={Number(maxWithdrawAssets)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxRedeemShares: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxRedeemShares = prefetched.maxRedeemShares}
					{#if maxRedeemShares !== undefined && maxRedeemShares !== null}
						<div>
							<dt>Max redeem shares</dt>
							<dd>
								<NumberValue value={Number(maxRedeemShares)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxRedeemShares = resolvedEntity.maxRedeemShares}
					{#if maxRedeemShares !== undefined && maxRedeemShares !== null}
						<div>
							<dt>Max redeem shares</dt>
							<dd>
								<NumberValue value={Number(maxRedeemShares)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							previewDepositShares: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previewDepositShares = prefetched.previewDepositShares}
					{#if previewDepositShares !== undefined && previewDepositShares !== null}
						<div>
							<dt>Preview deposit shares</dt>
							<dd>
								<NumberValue value={Number(previewDepositShares)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previewDepositShares = resolvedEntity.previewDepositShares}
					{#if previewDepositShares !== undefined && previewDepositShares !== null}
						<div>
							<dt>Preview deposit shares</dt>
							<dd>
								<NumberValue value={Number(previewDepositShares)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previewMintAssets: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previewMintAssets = prefetched.previewMintAssets}
					{#if previewMintAssets !== undefined && previewMintAssets !== null}
						<div>
							<dt>Preview mint assets</dt>
							<dd>
								<NumberValue value={Number(previewMintAssets)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previewMintAssets = resolvedEntity.previewMintAssets}
					{#if previewMintAssets !== undefined && previewMintAssets !== null}
						<div>
							<dt>Preview mint assets</dt>
							<dd>
								<NumberValue value={Number(previewMintAssets)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previewWithdrawShares: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previewWithdrawShares = prefetched.previewWithdrawShares}
					{#if previewWithdrawShares !== undefined && previewWithdrawShares !== null}
						<div>
							<dt>Preview withdraw shares</dt>
							<dd>
								<NumberValue value={Number(previewWithdrawShares)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previewWithdrawShares = resolvedEntity.previewWithdrawShares}
					{#if previewWithdrawShares !== undefined && previewWithdrawShares !== null}
						<div>
							<dt>Preview withdraw shares</dt>
							<dd>
								<NumberValue value={Number(previewWithdrawShares)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previewRedeemAssets: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previewRedeemAssets = prefetched.previewRedeemAssets}
					{#if previewRedeemAssets !== undefined && previewRedeemAssets !== null}
						<div>
							<dt>Preview redeem assets</dt>
							<dd>
								<NumberValue value={Number(previewRedeemAssets)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previewRedeemAssets = resolvedEntity.previewRedeemAssets}
					{#if previewRedeemAssets !== undefined && previewRedeemAssets !== null}
						<div>
							<dt>Preview redeem assets</dt>
							<dd>
								<NumberValue value={Number(previewRedeemAssets)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
