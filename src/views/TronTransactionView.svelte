<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TronTransaction>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const titleFallback = $derived(selection.entitySelector.transactionId || 'tron transaction')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TronBlockView from '$/views/TronBlockView.svelte'
	import TronContractView from '$/views/TronContractView.svelte'
	import TronTransactionReceiptView from '$/views/TronTransactionReceiptView.svelte'
	import TronAccountView from '$/views/TronAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.TronTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					transactionId: selection.entitySelector.transactionId,
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
		<TruncatedValue value={selection.entitySelector.transactionId} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={
				selection({
					fields: {
						result: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{(entity.result ?? '') || selection.entitySelector.transactionId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$owner}
		>
			{#snippet children(tronAccount)}
				{#if tronAccount != null}
					<span data-text="muted">
						<TronAccountView
							selection={select(EntityType.TronAccount, tronAccount[EntityMetaKey.Selector])}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary
			resource={selection.$to}
		>
			{#snippet children(tronAccount)}
				{#if tronAccount != null}
					<span data-text="muted">
						<TronAccountView
							selection={select(EntityType.TronAccount, tronAccount[EntityMetaKey.Selector])}
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

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(tronBlock)}
					{#if tronBlock != null}
						<div>
							<dt>Block</dt>
							<dd>
								<TronBlockView
									selection={select(EntityType.TronBlock, tronBlock[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHeight = entity.blockHeight}
					{#if blockHeight != null}
						<div>
							<dt>Block height</dt>
							<dd>
								{blockHeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expirationTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expirationTimestampMs = entity.expirationTimestampMs}
					{#if expirationTimestampMs != null}
						<div>
							<dt>Expiration timestamp</dt>
							<dd>
								<Timestamp timestamp={expirationTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contractType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contractType = entity.contractType}
					{#if contractType != null}
						<div>
							<dt>Contract type</dt>
							<dd>
								{contractType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeSun: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeSun = entity.feeSun}
					{#if feeSun != null}
						<div>
							<dt>Fee sun</dt>
							<dd>
								{feeSun}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet children(tronContract)}
					{#if tronContract != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<TronContractView
									selection={select(EntityType.TronContract, tronContract[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountSun: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountSun = entity.amountSun}
					{#if amountSun != null}
						<div>
							<dt>Amount sun</dt>
							<dd>
								{amountSun}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetName = entity.assetName}
					{#if assetName != null}
						<div>
							<dt>Asset name</dt>
							<dd>
								{assetName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rawDataHex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rawDataHex = entity.rawDataHex}
					{#if rawDataHex != null}
						<div>
							<dt>Raw data hex</dt>
							<dd>
								{rawDataHex}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Signatures</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signatures: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.signatures.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$receipt}
			>
				{#snippet children(tronTransactionReceipt)}
					{#if tronTransactionReceipt != null}
						<div>
							<dt>Receipt</dt>
							<dd>
								<TronTransactionReceiptView
									selection={select(EntityType.TronTransactionReceipt, tronTransactionReceipt[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
