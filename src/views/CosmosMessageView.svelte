<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CosmosMessage>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const cosmosMessage = $derived(selection({
		fields: {
			typeUrl: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import CosmosTransactionView from '$/views/CosmosTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosMessage}
	entitySelector={selection.entitySelector}
	title={title ?? `Message #${selection.entitySelector.indexInTransaction}`}
	idDragPlainText={String(selection.entitySelector.indexInTransaction)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/message/[indexInTransaction=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$network ?
							caip2StringFromValue(transaction.$network.caip2)
						:
							transaction.$network.slug
					),
					transactionId: transaction.txHash,
					indexInTransaction: String(selection.entitySelector.indexInTransaction),
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
		<span data-row="inline align-center gap-2 wrap">
			<span>Message </span>
			<span data-badge="small">
				#{selection.entitySelector.indexInTransaction}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.indexInTransaction}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosMessage}>
			{#snippet children(entity)}
				<span data-text="muted">
					<a
						href={entity.typeUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={entity.typeUrl} />
					</a>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Index in transaction</dt>
				<dd>
					{selection.entitySelector.indexInTransaction}
				</dd>
			</div>

			<div>
				<dt>Type URL</dt>
				<dd>
					<ResourceBoundary
						resource={cosmosMessage}
					>
						{#snippet children(entity)}
							<a
								href={entity.typeUrl}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.typeUrl} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const moduleName = entity.moduleName}
					{#if moduleName != null}
						<div>
							<dt>Module name</dt>
							<dd>
								{moduleName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							messageName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const messageName = entity.messageName}
					{#if messageName != null}
						<div>
							<dt>Message name</dt>
							<dd>
								{messageName}
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
							signerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signerAddress = entity.signerAddress}
					{#if signerAddress != null}
						<div>
							<dt>Signer address</dt>
							<dd>
								<TruncatedValue value={signerAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							senderAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const senderAddress = entity.senderAddress}
					{#if senderAddress != null}
						<div>
							<dt>Sender address</dt>
							<dd>
								<TruncatedValue value={senderAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							granterAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const granterAddress = entity.granterAddress}
					{#if granterAddress != null}
						<div>
							<dt>Granter address</dt>
							<dd>
								<TruncatedValue value={granterAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							granteeAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const granteeAddress = entity.granteeAddress}
					{#if granteeAddress != null}
						<div>
							<dt>Grantee address</dt>
							<dd>
								<TruncatedValue value={granteeAddress} />
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
							contractAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contractAddress = entity.contractAddress}
					{#if contractAddress != null}
						<div>
							<dt>Contract address</dt>
							<dd>
								<TruncatedValue value={contractAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Funds</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									funds: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.funds.values.map((value) => `${value.amount} ${value.denom}`).join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Event types</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									eventTypes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.eventTypes.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$signer}
			>
				{#snippet children(cosmosAccount)}
					{#if cosmosAccount != null}
						<div>
							<dt>Signer</dt>
							<dd>
								<CosmosAccountView
									selection={select(EntityType.CosmosAccount, cosmosAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Transaction</dt>
				<dd>
					<CosmosTransactionView
						selection={select(EntityType.CosmosTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
