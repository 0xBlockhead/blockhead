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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const cosmosMessage = $derived(selection({
		fields: {
			typeUrl: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.indexInTransaction) ?? '') ? 'Message #' + String((pendingEntity.indexInTransaction) ?? '') : '') || 'Cosmos message')
	const viewDomId = $derived('cosmos-message-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import CosmosTransactionView from '$/views/CosmosTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosMessage}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInTransaction ?? '')}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.indexInTransaction}
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
		{@const serialValue = pendingEntity.indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosMessage}>
			{#snippet Pending()}
				{@const typeUrl0 = pendingEntity.typeUrl}
				{#if typeUrl0 !== undefined && typeUrl0 !== null}
					<span data-text="muted">
						<svelte:element
							this={'a'}
							href={String(typeUrl0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(typeUrl0)} />
						</svelte:element>
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const typeUrl0 = resolvedEntity.typeUrl}
				{#if typeUrl0 !== undefined && typeUrl0 !== null}
					<span data-text="muted">
						<svelte:element
							this={'a'}
							href={String(typeUrl0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(typeUrl0)} />
						</svelte:element>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in transaction</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									indexInTransaction: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInTransaction = pendingEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								{String((indexInTransaction) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInTransaction = resolvedEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								{String((indexInTransaction) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Type URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									typeUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const typeUrl = pendingEntity.typeUrl}
							{#if typeUrl !== undefined && typeUrl !== null}
								<svelte:element
									this={'a'}
									href={String(typeUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(typeUrl)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const typeUrl = resolvedEntity.typeUrl}
							{#if typeUrl !== undefined && typeUrl !== null}
								<svelte:element
									this={'a'}
									href={String(typeUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(typeUrl)} />
								</svelte:element>
							{/if}
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
				{#snippet Pending()}
					{@const moduleName = pendingEntity.moduleName}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moduleName = resolvedEntity.moduleName}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							messageName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const messageName = pendingEntity.messageName}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const messageName = resolvedEntity.messageName}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							signerAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signerAddress = pendingEntity.signerAddress}
					{#if signerAddress !== undefined && signerAddress !== null}
						<div>
							<dt>Signer address</dt>
							<dd>
								<TruncatedValue value={String((signerAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signerAddress = resolvedEntity.signerAddress}
					{#if signerAddress !== undefined && signerAddress !== null}
						<div>
							<dt>Signer address</dt>
							<dd>
								<TruncatedValue value={String((signerAddress) ?? '')} />
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
				{#snippet Pending()}
					{@const senderAddress = pendingEntity.senderAddress}
					{#if senderAddress !== undefined && senderAddress !== null}
						<div>
							<dt>Sender address</dt>
							<dd>
								<TruncatedValue value={String((senderAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const senderAddress = resolvedEntity.senderAddress}
					{#if senderAddress !== undefined && senderAddress !== null}
						<div>
							<dt>Sender address</dt>
							<dd>
								<TruncatedValue value={String((senderAddress) ?? '')} />
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
				{#snippet Pending()}
					{@const granterAddress = pendingEntity.granterAddress}
					{#if granterAddress !== undefined && granterAddress !== null}
						<div>
							<dt>Granter address</dt>
							<dd>
								<TruncatedValue value={String((granterAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const granterAddress = resolvedEntity.granterAddress}
					{#if granterAddress !== undefined && granterAddress !== null}
						<div>
							<dt>Granter address</dt>
							<dd>
								<TruncatedValue value={String((granterAddress) ?? '')} />
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
				{#snippet Pending()}
					{@const granteeAddress = pendingEntity.granteeAddress}
					{#if granteeAddress !== undefined && granteeAddress !== null}
						<div>
							<dt>Grantee address</dt>
							<dd>
								<TruncatedValue value={String((granteeAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const granteeAddress = resolvedEntity.granteeAddress}
					{#if granteeAddress !== undefined && granteeAddress !== null}
						<div>
							<dt>Grantee address</dt>
							<dd>
								<TruncatedValue value={String((granteeAddress) ?? '')} />
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
				{#snippet Pending()}
					{@const contractAddress = pendingEntity.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>Contract address</dt>
							<dd>
								<TruncatedValue value={String((contractAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contractAddress = resolvedEntity.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>Contract address</dt>
							<dd>
								<TruncatedValue value={String((contractAddress) ?? '')} />
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
						{#snippet Pending()}
							{@const funds = pendingEntity.funds}
							{#if funds !== undefined && funds !== null}
								{funds.values.map((value) => String((`${value.amount} ${value.denom}`) ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const funds = resolvedEntity.funds}
							{#if funds !== undefined && funds !== null}
								{funds.values.map((value) => String((`${value.amount} ${value.denom}`) ?? '')).filter(Boolean).join(', ')}
							{/if}
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
						{#snippet Pending()}
							{@const eventTypes = pendingEntity.eventTypes}
							{#if eventTypes !== undefined && eventTypes !== null}
								{eventTypes.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eventTypes = resolvedEntity.eventTypes}
							{#if eventTypes !== undefined && eventTypes !== null}
								{eventTypes.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$signer}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(cosmosAccount)}
					{#if cosmosAccount != null && cosmosAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Signer</dt>
							<dd>
								<CosmosAccountView
									selection={select(EntityType.CosmosAccount, cosmosAccount[EntityMetaKey.Selector])}
									prefetched={cosmosAccount}
									layout={EntityLayout.Value}
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
						selection={select(EntityType.CosmosTransaction, selection.entitySelector.$transaction, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
