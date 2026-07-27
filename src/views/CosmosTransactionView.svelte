<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.CosmosTransaction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const cosmosTransaction = $derived(selection({
		fields: {
			code: true,
			gasUsed: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.txHash ?? '') || 'Cosmos transaction')


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
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={pendingEntity.txHash} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={pendingEntity.txHash} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosTransaction}>
			{#snippet children(entity)}
				{@const code0 = entity.code}
				{#if code0 != null}
					<span data-text="muted">
						{String(code0)}
					</span>
				{/if}
				{@const gasUsed1 = entity.gasUsed}
				{#if gasUsed1 != null}
					<span data-text="muted">
						{String(gasUsed1)}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction hash</dt>
				<dd>
					<TruncatedValue value={pendingEntity.txHash} />
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
								{String(code)}
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
								{String(gasWanted)}
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
								{String(gasUsed)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Fee amount</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									feeAmount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.feeAmount.values.map((value) => `${value.amount} ${value.denom}`).join(', ')}
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
								{String(feeGasLimit)}
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
								{String(timeoutHeight)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Signer addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signerAddresses: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.signerAddresses.values.join(', ')} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							<TruncatedValue value={entity.signatures.values.join(', ')} />
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
				resource={selection.$block}
			>
				{#snippet children(cosmosBlock)}
					{#if cosmosBlock != null}
						<div>
							<dt>Block</dt>
							<dd>
								<CosmosBlockView
									selection={select(EntityType.CosmosBlock, cosmosBlock[EntityMetaKey.Selector])}
									prefetched={cosmosBlock}
									layout={EntityLayout.Value}
									open={false}
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
						open={false}
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

	{#snippet Details({ open: detailsOpen })}
		{@const cosmosTransactionCosmosMessagesViewMessagesResource = selection.$$messages}
		<ResourceBoundary
			resource={cosmosTransactionCosmosMessagesViewMessagesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CosmosMessagesView
						selection={cosmosTransactionCosmosMessagesViewMessagesResource}
						countResource={cosmosTransactionCosmosMessagesViewMessagesResource.count}
						title='Messages'
						id='messages'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
