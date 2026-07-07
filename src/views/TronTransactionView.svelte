<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.TronTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TronTransaction>>
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
	const tronTransaction = $derived(selection({}))
	const titleFallback = $derived('tron transaction')
	const viewDomId = $derived('tron-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TronBlockView from '$/views/TronBlockView.svelte'
	import TronAccountView from '$/views/TronAccountView.svelte'
	import TronContractView from '$/views/TronContractView.svelte'
	import TronTransactionReceiptView from '$/views/TronTransactionReceiptView.svelte'
</script>


<EntityView
	entityType={EntityType.TronTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tronTransaction}>
			{#snippet Pending()}
				{title || 'tron transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transactionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transactionId = selection.entitySelector.transactionId ?? prefetched.transactionId}
							{#if transactionId !== undefined && transactionId !== null}
								{String((transactionId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionId = resolvedEntity.transactionId}
							{#if transactionId !== undefined && transactionId !== null}
								{String((transactionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection[EntityProxyField]<EntityType.TronBlock, false>('$block', {
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
							Source.ThreeXpl_Rest,
						],
					})
				}
			>
				{#snippet children(tronBlock)}
					{#if tronBlock != null && tronBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Block</dt>
							<dd>
								<TronBlockView
									selection={select(EntityType.TronBlock, tronBlock[EntityMetaKey.Selector])}
									prefetched={tronBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
							Source.ThreeXpl_Rest,
						],
						fields: {
							blockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockHeight = prefetched.blockHeight}
					{#if blockHeight !== undefined && blockHeight !== null}
						<div>
							<dt>Block height</dt>
							<dd>
								{String((blockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockHeight = resolvedEntity.blockHeight}
					{#if blockHeight !== undefined && blockHeight !== null}
						<div>
							<dt>Block height</dt>
							<dd>
								{String((blockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
							Source.ThreeXpl_Rest,
						],
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
						],
						fields: {
							expirationTimestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expirationTimestampMs = prefetched.expirationTimestampMs}
					{#if expirationTimestampMs !== undefined && expirationTimestampMs !== null}
						<div>
							<dt>Expiration timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(expirationTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expirationTimestampMs = resolvedEntity.expirationTimestampMs}
					{#if expirationTimestampMs !== undefined && expirationTimestampMs !== null}
						<div>
							<dt>Expiration timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(expirationTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
						],
						fields: {
							contractType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contractType = prefetched.contractType}
					{#if contractType !== undefined && contractType !== null}
						<div>
							<dt>Contract type</dt>
							<dd>
								{String((contractType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contractType = resolvedEntity.contractType}
					{#if contractType !== undefined && contractType !== null}
						<div>
							<dt>Contract type</dt>
							<dd>
								{String((contractType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
						],
						fields: {
							result: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const result = prefetched.result}
					{#if result !== undefined && result !== null}
						<div>
							<dt>Result</dt>
							<dd>
								{String((result) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const result = resolvedEntity.result}
					{#if result !== undefined && result !== null}
						<div>
							<dt>Result</dt>
							<dd>
								{String((result) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronScan_Rest,
						],
						fields: {
							feeSun: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeSun = prefetched.feeSun}
					{#if feeSun !== undefined && feeSun !== null}
						<div>
							<dt>Fee sun</dt>
							<dd>
								{String((feeSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeSun = resolvedEntity.feeSun}
					{#if feeSun !== undefined && feeSun !== null}
						<div>
							<dt>Fee sun</dt>
							<dd>
								{String((feeSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection[EntityProxyField]<EntityType.TronAccount, false>('$owner', {
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
						],
					})
				}
			>
				{#snippet children(tronAccount)}
					{#if tronAccount != null && tronAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<TronAccountView
									selection={select(EntityType.TronAccount, tronAccount[EntityMetaKey.Selector])}
									prefetched={tronAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection[EntityProxyField]<EntityType.TronAccount, false>('$to', {
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
						],
					})
				}
			>
				{#snippet children(tronAccount)}
					{#if tronAccount != null && tronAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>To</dt>
							<dd>
								<TronAccountView
									selection={select(EntityType.TronAccount, tronAccount[EntityMetaKey.Selector])}
									prefetched={tronAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection[EntityProxyField]<EntityType.TronContract, false>('$contract', {
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
						],
					})
				}
			>
				{#snippet children(tronContract)}
					{#if tronContract != null && tronContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<TronContractView
									selection={select(EntityType.TronContract, tronContract[EntityMetaKey.Selector])}
									prefetched={tronContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
						],
						fields: {
							amountSun: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountSun = prefetched.amountSun}
					{#if amountSun !== undefined && amountSun !== null}
						<div>
							<dt>Amount sun</dt>
							<dd>
								{String((amountSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountSun = resolvedEntity.amountSun}
					{#if amountSun !== undefined && amountSun !== null}
						<div>
							<dt>Amount sun</dt>
							<dd>
								{String((amountSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
						],
						fields: {
							assetName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetName = prefetched.assetName}
					{#if assetName !== undefined && assetName !== null}
						<div>
							<dt>Asset name</dt>
							<dd>
								{String((assetName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetName = resolvedEntity.assetName}
					{#if assetName !== undefined && assetName !== null}
						<div>
							<dt>Asset name</dt>
							<dd>
								{String((assetName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
						],
						fields: {
							rawDataHex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rawDataHex = prefetched.rawDataHex}
					{#if rawDataHex !== undefined && rawDataHex !== null}
						<div>
							<dt>Raw data hex</dt>
							<dd>
								{String((rawDataHex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rawDataHex = resolvedEntity.rawDataHex}
					{#if rawDataHex !== undefined && rawDataHex !== null}
						<div>
							<dt>Raw data hex</dt>
							<dd>
								{String((rawDataHex) ?? '')}
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
								sources: [
									Source.TronGrid_Rest,
									Source.TronFullNode_Rest,
									Source.TronSolidityNode_Rest,
								],
								fields: {
									signatures: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const signatures = prefetched.signatures}
							{#if signatures !== undefined && signatures !== null}
								<TruncatedValue value={signatures.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signatures = resolvedEntity.signatures}
							{#if signatures !== undefined && signatures !== null}
								<TruncatedValue value={signatures.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection[EntityProxyField]<EntityType.TronTransactionReceipt, false>('$receipt', {
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
						],
					})
				}
			>
				{#snippet children(tronTransactionReceipt)}
					{#if tronTransactionReceipt != null && tronTransactionReceipt[EntityMetaKey.Selector] != null}
						<div>
							<dt>Receipt</dt>
							<dd>
								<TronTransactionReceiptView
									selection={select(EntityType.TronTransactionReceipt, tronTransactionReceipt[EntityMetaKey.Selector])}
									prefetched={tronTransactionReceipt}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
