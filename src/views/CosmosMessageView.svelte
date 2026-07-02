<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosMessage>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosMessage>>
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

	const cosmosMessage = $derived(selection({
		fields: {
			typeUrl: true,
			moduleName: true,
			messageName: true,
			signerAddress: true,
			senderAddress: true,
			granterAddress: true,
			granteeAddress: true,
			contractAddress: true,
			funds: true,
			eventTypes: true,
			$signer: true,
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') ? 'Message #' + String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') : '') || 'Cosmos message')
	const viewDomId = $derived('cosmos-message-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import CosmosTransactionView from '$/views/CosmosTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosMessage}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/tx/[txHash]/messages/[messageIndex=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2.reference)}`,
			txHash: String(({ ...selection.entitySelector, ...prefetched }).$transaction.txHash),
			messageIndex: String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Message </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const typeUrl0 = prefetched.typeUrl}
			{#if typeUrl0 !== undefined && typeUrl0 !== null}
				<span data-text="muted">
					{String((typeUrl0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosMessage}>
				{#snippet Pending()}
					{@const typeUrl0 = prefetched.typeUrl}
					{#if typeUrl0 !== undefined && typeUrl0 !== null}
						<span data-text="muted">
							{String((typeUrl0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const typeUrl0 = entity.typeUrl}
					{#if typeUrl0 !== undefined && typeUrl0 !== null}
						<span data-text="muted">
							{String((typeUrl0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in transaction</dt>
				<dd>
					<ResourceBoundary resource={cosmosMessage}>
						{#snippet Pending()}
							{@const indexInTransaction = prefetched.indexInTransaction ?? selection.entitySelector.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								{String((indexInTransaction) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const indexInTransaction = entity.indexInTransaction ?? selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								{String((indexInTransaction) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={cosmosMessage}>
				{#snippet Pending()}
					{@const moduleName = prefetched.moduleName ?? selection.entitySelector.moduleName}
					{#if moduleName !== undefined && moduleName !== null}
						<div>
							<dt>Module name</dt>
							<dd>
								{String((moduleName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const moduleName = entity.moduleName ?? selection.entitySelector.moduleName ?? prefetched.moduleName}
					{#if moduleName !== undefined && moduleName !== null}
						<div>
							<dt>Module name</dt>
							<dd>
								{String((moduleName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosMessage}>
				{#snippet Pending()}
					{@const messageName = prefetched.messageName ?? selection.entitySelector.messageName}
					{#if messageName !== undefined && messageName !== null}
						<div>
							<dt>Message name</dt>
							<dd>
								{String((messageName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const messageName = entity.messageName ?? selection.entitySelector.messageName ?? prefetched.messageName}
					{#if messageName !== undefined && messageName !== null}
						<div>
							<dt>Message name</dt>
							<dd>
								{String((messageName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={cosmosMessage}>
				{#snippet Pending()}
					{@const signerAddress = prefetched.signerAddress ?? selection.entitySelector.signerAddress}
					{#if signerAddress !== undefined && signerAddress !== null}
						<div>
							<dt>Signer address</dt>
							<dd>
								{String((signerAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const signerAddress = entity.signerAddress ?? selection.entitySelector.signerAddress ?? prefetched.signerAddress}
					{#if signerAddress !== undefined && signerAddress !== null}
						<div>
							<dt>Signer address</dt>
							<dd>
								{String((signerAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosMessage}>
				{#snippet Pending()}
					{@const senderAddress = prefetched.senderAddress ?? selection.entitySelector.senderAddress}
					{#if senderAddress !== undefined && senderAddress !== null}
						<div>
							<dt>Sender address</dt>
							<dd>
								{String((senderAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const senderAddress = entity.senderAddress ?? selection.entitySelector.senderAddress ?? prefetched.senderAddress}
					{#if senderAddress !== undefined && senderAddress !== null}
						<div>
							<dt>Sender address</dt>
							<dd>
								{String((senderAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosMessage}>
				{#snippet Pending()}
					{@const granterAddress = prefetched.granterAddress ?? selection.entitySelector.granterAddress}
					{#if granterAddress !== undefined && granterAddress !== null}
						<div>
							<dt>Granter address</dt>
							<dd>
								{String((granterAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const granterAddress = entity.granterAddress ?? selection.entitySelector.granterAddress ?? prefetched.granterAddress}
					{#if granterAddress !== undefined && granterAddress !== null}
						<div>
							<dt>Granter address</dt>
							<dd>
								{String((granterAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosMessage}>
				{#snippet Pending()}
					{@const granteeAddress = prefetched.granteeAddress ?? selection.entitySelector.granteeAddress}
					{#if granteeAddress !== undefined && granteeAddress !== null}
						<div>
							<dt>Grantee address</dt>
							<dd>
								{String((granteeAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const granteeAddress = entity.granteeAddress ?? selection.entitySelector.granteeAddress ?? prefetched.granteeAddress}
					{#if granteeAddress !== undefined && granteeAddress !== null}
						<div>
							<dt>Grantee address</dt>
							<dd>
								{String((granteeAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={cosmosMessage}>
				{#snippet Pending()}
					{@const contractAddress = prefetched.contractAddress ?? selection.entitySelector.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>Contract address</dt>
							<dd>
								{String((contractAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const contractAddress = entity.contractAddress ?? selection.entitySelector.contractAddress ?? prefetched.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>Contract address</dt>
							<dd>
								{String((contractAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Funds</dt>
				<dd>
					<ResourceBoundary resource={cosmosMessage}>
						{#snippet Pending()}
							{@const funds = prefetched.funds ?? selection.entitySelector.funds}
							{#if funds !== undefined && funds !== null}
								{funds.map((value) => String((`${value.amount} ${value.denom}`) ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const funds = entity.funds ?? selection.entitySelector.funds ?? prefetched.funds}
							{#if funds !== undefined && funds !== null}
								{funds.map((value) => String((`${value.amount} ${value.denom}`) ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Event types</dt>
				<dd>
					<ResourceBoundary resource={cosmosMessage}>
						{#snippet Pending()}
							{@const eventTypes = prefetched.eventTypes ?? selection.entitySelector.eventTypes}
							{#if eventTypes !== undefined && eventTypes !== null}
								{String((eventTypes) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const eventTypes = entity.eventTypes ?? selection.entitySelector.eventTypes ?? prefetched.eventTypes}
							{#if eventTypes !== undefined && eventTypes !== null}
								{String((eventTypes) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.CosmosAccount, false>('$signer')}
			>
				{#snippet children(cosmosAccount)}
					{#if cosmosAccount != null}
						<div>
							<dt>Signer</dt>
							<dd>
								<CosmosAccountView
									selection={select(EntityType.CosmosAccount, cosmosAccount.entitySelector)}
									prefetched={cosmosAccount}
									href={
										resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
											caip2: `${String(cosmosAccount.entitySelector.$network.caip2.namespace)}:${String(cosmosAccount.entitySelector.$network.caip2.reference)}`,
											address: String(cosmosAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
									open={false}
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
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/tx/[txHash]', {
								caip2: `${String(selection.entitySelector.$transaction.$network.caip2.namespace)}:${String(selection.entitySelector.$transaction.$network.caip2.reference)}`,
								txHash: String(selection.entitySelector.$transaction.txHash),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
