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
	}: Omit<EntitySelectionViewProps<EntityType.CosmosTransaction>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const cosmosTransaction = $derived(selection({
		fields: {
			code: true,
			gasUsed: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosMessagesView from '$/views/CosmosMessagesView.svelte'
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.txHash || 'Cosmos transaction')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
				{
					network: (
						network.caip2 !== undefined ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					transactionId: selection.entitySelector.txHash,
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
		<TruncatedValue value={selection.entitySelector.txHash} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.txHash} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosTransaction}>
			{#snippet children(entity)}
				{@const code = entity.code}
				{#if code != null}
					<span data-text="muted">
						{code}
					</span>
				{/if}
				{@const gasUsed = entity.gasUsed}
				{#if gasUsed != null}
					<span data-text="muted">
						{gasUsed}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Transaction hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.txHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={cosmosTransaction}
			>
				{#snippet children(entity)}
					{@const code = entity.code}
					{#if code != null}
						<div>
							<dt>Code</dt>
							<dd>
								{code}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							codespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const codespace = entity.codespace}
					{#if codespace != null}
						<div>
							<dt>Codespace</dt>
							<dd>
								{codespace}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasWanted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasWanted = entity.gasWanted}
					{#if gasWanted != null}
						<div>
							<dt>Gas wanted</dt>
							<dd>
								{gasWanted}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cosmosTransaction}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>Gas used</dt>
							<dd>
								{gasUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Fee amount</dt>
				<dd>
					<ResourceBoundary
						resource={selection.feeAmount}
					>
						{#snippet children(feeAmount)}
							{feeAmount.values.map((value) => `${value.amount} ${value.denom}`).join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeGasLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeGasLimit = entity.feeGasLimit}
					{#if feeGasLimit != null}
						<div>
							<dt>Fee gas limit</dt>
							<dd>
								{feeGasLimit}
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
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memo = entity.memo}
					{#if memo != null}
						<div>
							<dt>Memo</dt>
							<dd>
								{memo}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timeoutHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timeoutHeight = entity.timeoutHeight}
					{#if timeoutHeight != null}
						<div>
							<dt>Timeout height</dt>
							<dd>
								{timeoutHeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Signer addresses</dt>
				<dd>
					<ResourceBoundary
						resource={selection.signerAddresses}
					>
						{#snippet children(signerAddresses)}
							{signerAddresses.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Signatures</dt>
				<dd>
					<ResourceBoundary
						resource={selection.signatures}
					>
						{#snippet children(signatures)}
							{signatures.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Event types</dt>
				<dd>
					<ResourceBoundary
						resource={selection.eventTypes}
					>
						{#snippet children(eventTypes)}
							{eventTypes.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(cosmosBlock)}
					{#if cosmosBlock != null}
						{@const cosmosBlockInitial = untrack(() => cosmosBlock)}
						<div>
							<dt>Block</dt>
							<dd>
								<CosmosBlockView
									selection={select(EntityType.CosmosBlock, (cosmosBlock ?? cosmosBlockInitial)[EntityMetaKey.Selector])}
									prefetched={cosmosBlock ?? cosmosBlockInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						rawLog: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const rawLog = entity.rawLog}
				{#if rawLog != null && rawLog !== ''}
					<code>{rawLog}</code>
				{:else}
					<p data-text="muted">No raw log available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const messagesResource = selection.$$messages}
		<ResourceBoundary
			resource={messagesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CosmosMessagesView
						selection={messagesResource}
						countResource={messagesResource.count}
						title='Messages'
						id='messages'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
