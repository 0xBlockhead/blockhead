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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosTransaction>>
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
	const cosmosTransaction = $derived(selection({
		fields: {
			code: true,
			gasUsed: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.txHash ?? prefetched.txHash) ?? '')].filter(Boolean).join(' ') || 'Cosmos transaction')
	const viewDomId = $derived('cosmos-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosMessagesView from '$/views/CosmosMessagesView.svelte'
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.txHash !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/tx/[txHash]', {
			caip2: `${String(pendingEntity.$network.caip2.namespace ?? '')}:${String(pendingEntity.$network.caip2.reference ?? '')}`,
			txHash: String(pendingEntity.txHash ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosTransaction}>
			{#snippet Pending()}
				{@const txHash0 = selection.entitySelector.txHash ?? prefetched.txHash}
				{#if txHash0 !== undefined && txHash0 !== null}
					<TruncatedValue value={String((txHash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const txHash0 = resolvedEntity.txHash}
				{#if txHash0 !== undefined && txHash0 !== null}
					<TruncatedValue value={String((txHash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosTransaction}>
			{#snippet Pending()}
				{@const txHash0 = selection.entitySelector.txHash ?? prefetched.txHash}
				{#if txHash0 !== undefined && txHash0 !== null}
					<TruncatedValue value={String((txHash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const txHash0 = resolvedEntity.txHash}
				{#if txHash0 !== undefined && txHash0 !== null}
					<TruncatedValue value={String((txHash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosTransaction}>
			{#snippet Pending()}
				{@const code0 = prefetched.code}
				{#if code0 !== undefined && code0 !== null}
					<span data-text="muted">
						{String((code0) ?? '')}
					</span>
				{/if}
				{@const gasUsed1 = prefetched.gasUsed}
				{#if gasUsed1 !== undefined && gasUsed1 !== null}
					<span data-text="muted">
						{String((gasUsed1) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const code0 = resolvedEntity.code}
				{#if code0 !== undefined && code0 !== null}
					<span data-text="muted">
						{String((code0) ?? '')}
					</span>
				{/if}
				{@const gasUsed1 = resolvedEntity.gasUsed}
				{#if gasUsed1 !== undefined && gasUsed1 !== null}
					<span data-text="muted">
						{String((gasUsed1) ?? '')}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									txHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const txHash = selection.entitySelector.txHash ?? prefetched.txHash}
							{#if txHash !== undefined && txHash !== null}
								<TruncatedValue value={String((txHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txHash = resolvedEntity.txHash}
							{#if txHash !== undefined && txHash !== null}
								<TruncatedValue value={String((txHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							code: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const code = prefetched.code}
					{#if code !== undefined && code !== null}
						<div>
							<dt>Code</dt>
							<dd>
								{String((code) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const code = resolvedEntity.code}
					{#if code !== undefined && code !== null}
						<div>
							<dt>Code</dt>
							<dd>
								{String((code) ?? '')}
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
				{#snippet Pending()}
					{@const codespace = prefetched.codespace}
					{#if codespace !== undefined && codespace !== null}
						<div>
							<dt>Codespace</dt>
							<dd>
								{String((codespace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const codespace = resolvedEntity.codespace}
					{#if codespace !== undefined && codespace !== null}
						<div>
							<dt>Codespace</dt>
							<dd>
								{String((codespace) ?? '')}
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
				{#snippet Pending()}
					{@const gasWanted = prefetched.gasWanted}
					{#if gasWanted !== undefined && gasWanted !== null}
						<div>
							<dt>Gas wanted</dt>
							<dd>
								{String((gasWanted) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasWanted = resolvedEntity.gasWanted}
					{#if gasWanted !== undefined && gasWanted !== null}
						<div>
							<dt>Gas wanted</dt>
							<dd>
								{String((gasWanted) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasUsed = prefetched.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>Gas used</dt>
							<dd>
								{String((gasUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed = resolvedEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>Gas used</dt>
							<dd>
								{String((gasUsed) ?? '')}
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
						{#snippet Pending()}
							{@const feeAmount = prefetched.feeAmount}
							{#if feeAmount !== undefined && feeAmount !== null}
								{(feeAmount?.values ?? []).map((value) => String((`${value.amount} ${value.denom}`) ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const feeAmount = resolvedEntity.feeAmount}
							{#if feeAmount !== undefined && feeAmount !== null}
								{(feeAmount?.values ?? []).map((value) => String((`${value.amount} ${value.denom}`) ?? '')).filter(Boolean).join(', ')}
							{/if}
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
				{#snippet Pending()}
					{@const feeGasLimit = prefetched.feeGasLimit}
					{#if feeGasLimit !== undefined && feeGasLimit !== null}
						<div>
							<dt>Fee gas limit</dt>
							<dd>
								{String((feeGasLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeGasLimit = resolvedEntity.feeGasLimit}
					{#if feeGasLimit !== undefined && feeGasLimit !== null}
						<div>
							<dt>Fee gas limit</dt>
							<dd>
								{String((feeGasLimit) ?? '')}
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
				{#snippet Pending()}
					{@const memo = prefetched.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>Memo</dt>
							<dd>
								{String((memo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const memo = resolvedEntity.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>Memo</dt>
							<dd>
								{String((memo) ?? '')}
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
				{#snippet Pending()}
					{@const timeoutHeight = prefetched.timeoutHeight}
					{#if timeoutHeight !== undefined && timeoutHeight !== null}
						<div>
							<dt>Timeout height</dt>
							<dd>
								{String((timeoutHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timeoutHeight = resolvedEntity.timeoutHeight}
					{#if timeoutHeight !== undefined && timeoutHeight !== null}
						<div>
							<dt>Timeout height</dt>
							<dd>
								{String((timeoutHeight) ?? '')}
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
						{#snippet Pending()}
							{@const signerAddresses = prefetched.signerAddresses}
							{#if signerAddresses !== undefined && signerAddresses !== null}
								<TruncatedValue value={(signerAddresses?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signerAddresses = resolvedEntity.signerAddresses}
							{#if signerAddresses !== undefined && signerAddresses !== null}
								<TruncatedValue value={(signerAddresses?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
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
						{#snippet Pending()}
							{@const signatures = prefetched.signatures}
							{#if signatures !== undefined && signatures !== null}
								<TruncatedValue value={(signatures?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signatures = resolvedEntity.signatures}
							{#if signatures !== undefined && signatures !== null}
								<TruncatedValue value={(signatures?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
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
							{@const eventTypes = prefetched.eventTypes}
							{#if eventTypes !== undefined && eventTypes !== null}
								{(eventTypes?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eventTypes = resolvedEntity.eventTypes}
							{#if eventTypes !== undefined && eventTypes !== null}
								{(eventTypes?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.CosmosBlock, false>('$block')}
			>
				{#snippet children(cosmosBlock)}
					{#if cosmosBlock != null && cosmosBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Block</dt>
							<dd>
								<CosmosBlockView
									selection={select(EntityType.CosmosBlock, cosmosBlock[EntityMetaKey.Selector])}
									prefetched={cosmosBlock}
									href={
										(cosmosBlock[EntityMetaKey.Selector].$network !== undefined && cosmosBlock[EntityMetaKey.Selector].$network.caip2 !== undefined && cosmosBlock[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && cosmosBlock[EntityMetaKey.Selector].$network !== undefined && cosmosBlock[EntityMetaKey.Selector].$network.caip2 !== undefined && cosmosBlock[EntityMetaKey.Selector].$network.caip2.reference !== undefined && cosmosBlock[EntityMetaKey.Selector].height !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/block/[height=nonNegativeInteger]', {
											caip2: `${String(cosmosBlock[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(cosmosBlock[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
											height: String(cosmosBlock[EntityMetaKey.Selector].height ?? ''),
										}) : undefined)
									}
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
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
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
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const rawLog = resolvedEntity.rawLog}
				{#if rawLog !== undefined && rawLog !== null && rawLog !== ''}
					<code>{String((rawLog) ?? '')}</code>
				{:else}
					<p data-text="muted">No raw log available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CosmosMessagesView
				selection={selection[EntityProxyField]<EntityType.CosmosMessage>('$$messages')}
				title='Messages'
				emptyText='No Cosmos messages.'
				id='CosmosMessagesView-$$messages'
			/>
		{/if}
	{/snippet}
</EntityView>
