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
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletRequest>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadWalletRequest>>
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
	const blockheadWalletRequest = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			requestKind: true,
			requestMethod: true,
			requestedAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.requestKind) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet request')
	const viewDomId = $derived('blockhead-wallet-request-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletRequestCallsView from '$/views/BlockheadWalletRequestCallsView.svelte'
	import BlockheadWalletRequest_TimestampsView from '$/views/BlockheadWalletRequest_TimestampsView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
	import BlockheadIntentOrderView from '$/views/BlockheadIntentOrderView.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletRequest}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadWalletRequest}>
			{#snippet Pending()}
				{[String((pendingEntity.requestKind) ?? '')].filter(Boolean).join(' ') || title || 'blockhead wallet request'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.requestKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletRequest}>
			{#snippet Pending()}
				{[String((pendingEntity.requestMethod) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.requestKind) ?? '')].filter(Boolean).join(' ') || title || 'blockhead wallet request'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.requestMethod) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.requestKind) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadWalletRequest}>
			{#snippet Pending()}
				{@const requestedAt0 = pendingEntity.requestedAt}
				{#if requestedAt0 !== undefined && requestedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(requestedAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const requestedAt0 = resolvedEntity.requestedAt}
				{#if requestedAt0 !== undefined && requestedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(requestedAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const id = pendingEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$sessionAction}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadSessionAction)}
					{#if blockheadSessionAction != null && blockheadSessionAction[EntityMetaKey.Selector] != null}
						<div>
							<dt>session action</dt>
							<dd>
								<BlockheadSessionActionView
									selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
									prefetched={blockheadSessionAction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$intentOrder}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadIntentOrder)}
					{#if blockheadIntentOrder != null && blockheadIntentOrder[EntityMetaKey.Selector] != null}
						<div>
							<dt>intent order</dt>
							<dd>
								<BlockheadIntentOrderView
									selection={select(EntityType.BlockheadIntentOrder, blockheadIntentOrder[EntityMetaKey.Selector])}
									prefetched={blockheadIntentOrder}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$walletConnection}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadWalletConnection)}
					{#if blockheadWalletConnection != null && blockheadWalletConnection[EntityMetaKey.Selector] != null}
						<div>
							<dt>wallet connection</dt>
							<dd>
								<BlockheadWalletConnectionView
									selection={select(EntityType.BlockheadWalletConnection, blockheadWalletConnection[EntityMetaKey.Selector])}
									prefetched={blockheadWalletConnection}
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
						fields: {
							walletProtocol: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const walletProtocol = pendingEntity.walletProtocol}
					{#if walletProtocol !== undefined && walletProtocol !== null}
						<div>
							<dt>wallet protocol</dt>
							<dd>
								{String((walletProtocol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const walletProtocol = resolvedEntity.walletProtocol}
					{#if walletProtocol !== undefined && walletProtocol !== null}
						<div>
							<dt>wallet protocol</dt>
							<dd>
								{String((walletProtocol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							caip10: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const caip10 = pendingEntity.caip10}
					{#if caip10 !== undefined && caip10 !== null}
						<div>
							<dt>CAIP-10</dt>
							<dd>
								<TruncatedValue value={caip10 == null ? '' : String((`${(caip10).namespace}:${(caip10).reference}:${(caip10).accountAddress}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const caip10 = resolvedEntity.caip10}
					{#if caip10 !== undefined && caip10 !== null}
						<div>
							<dt>CAIP-10</dt>
							<dd>
								<TruncatedValue value={caip10 == null ? '' : String((`${(caip10).namespace}:${(caip10).reference}:${(caip10).accountAddress}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>request kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									requestKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const requestKind = pendingEntity.requestKind}
							{#if requestKind !== undefined && requestKind !== null}
								{String((requestKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const requestKind = resolvedEntity.requestKind}
							{#if requestKind !== undefined && requestKind !== null}
								{String((requestKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>request method</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									requestMethod: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const requestMethod = pendingEntity.requestMethod}
							{#if requestMethod !== undefined && requestMethod !== null}
								{String((requestMethod) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const requestMethod = resolvedEntity.requestMethod}
							{#if requestMethod !== undefined && requestMethod !== null}
								{String((requestMethod) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							chainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chainId = pendingEntity.chainId}
					{#if chainId !== undefined && chainId !== null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								<NumberValue value={Number(chainId)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chainId = resolvedEntity.chainId}
					{#if chainId !== undefined && chainId !== null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								<NumberValue value={Number(chainId)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fromAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fromAddress = pendingEntity.fromAddress}
					{#if fromAddress !== undefined && fromAddress !== null}
						<div>
							<dt>from address</dt>
							<dd>
								<TruncatedValue value={String((fromAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fromAddress = resolvedEntity.fromAddress}
					{#if fromAddress !== undefined && fromAddress !== null}
						<div>
							<dt>from address</dt>
							<dd>
								<TruncatedValue value={String((fromAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const toAddress = pendingEntity.toAddress}
					{#if toAddress !== undefined && toAddress !== null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={String((toAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toAddress = resolvedEntity.toAddress}
					{#if toAddress !== undefined && toAddress !== null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={String((toAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							value: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const value = pendingEntity.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={Number(value)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const value = resolvedEntity.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={Number(value)} />
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
							callCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const callCount = pendingEntity.callCount}
					{#if callCount !== undefined && callCount !== null}
						<div>
							<dt>call count</dt>
							<dd>
								<NumberValue value={Number(callCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const callCount = resolvedEntity.callCount}
					{#if callCount !== undefined && callCount !== null}
						<div>
							<dt>call count</dt>
							<dd>
								<NumberValue value={Number(callCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							atomicRequired: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const atomicRequired = pendingEntity.atomicRequired}
					{#if atomicRequired !== undefined && atomicRequired !== null}
						<div>
							<dt>atomic required</dt>
							<dd>
								{atomicRequired ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const atomicRequired = resolvedEntity.atomicRequired}
					{#if atomicRequired !== undefined && atomicRequired !== null}
						<div>
							<dt>atomic required</dt>
							<dd>
								{atomicRequired ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							requestPayloadHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requestPayloadHash = pendingEntity.requestPayloadHash}
					{#if requestPayloadHash !== undefined && requestPayloadHash !== null}
						<div>
							<dt>request payload hash</dt>
							<dd>
								<TruncatedValue value={String((requestPayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requestPayloadHash = resolvedEntity.requestPayloadHash}
					{#if requestPayloadHash !== undefined && requestPayloadHash !== null}
						<div>
							<dt>request payload hash</dt>
							<dd>
								<TruncatedValue value={String((requestPayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							walletCallBundleId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const walletCallBundleId = pendingEntity.walletCallBundleId}
					{#if walletCallBundleId !== undefined && walletCallBundleId !== null}
						<div>
							<dt>wallet call bundle ID</dt>
							<dd>
								{String((walletCallBundleId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const walletCallBundleId = resolvedEntity.walletCallBundleId}
					{#if walletCallBundleId !== undefined && walletCallBundleId !== null}
						<div>
							<dt>wallet call bundle ID</dt>
							<dd>
								{String((walletCallBundleId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>requested AT</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									requestedAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const requestedAt = pendingEntity.requestedAt}
							{#if requestedAt !== undefined && requestedAt !== null}
								<Timestamp timestamp={Number(requestedAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const requestedAt = resolvedEntity.requestedAt}
							{#if requestedAt !== undefined && requestedAt !== null}
								<Timestamp timestamp={Number(requestedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							submittedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const submittedAt = pendingEntity.submittedAt}
					{#if submittedAt !== undefined && submittedAt !== null}
						<div>
							<dt>submitted AT</dt>
							<dd>
								<Timestamp timestamp={Number(submittedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const submittedAt = resolvedEntity.submittedAt}
					{#if submittedAt !== undefined && submittedAt !== null}
						<div>
							<dt>submitted AT</dt>
							<dd>
								<Timestamp timestamp={Number(submittedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadWalletRequestCallsView
				selection={
						selection.$$calls({
							count: true,
						})
					}
				title='calls'
				emptyText='No wallet request calls.'
				id='BlockheadWalletRequestCallsView-calls'
			/>

			<BlockheadWalletRequest_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No wallet request observations.'
				id='BlockheadWalletRequest_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
