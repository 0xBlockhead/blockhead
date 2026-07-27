<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadWalletRequest> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWalletRequest = $derived(viewSelection({
		fields: {
			requestKind: true,
			requestMethod: true,
			requestedAt: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.requestKind ?? '') || 'blockhead wallet request')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadWalletRequest}>
			{#snippet children(entity)}
				{entity.requestKind || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletRequest}>
			{#snippet children(entity)}
				{entity.requestMethod || entity.requestKind || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadWalletRequest}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={Number(entity.requestedAt)} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{pendingEntity.id}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$sessionAction}
			>
				{#snippet children(blockheadSessionAction)}
					{#if blockheadSessionAction != null}
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
				{#snippet children(blockheadIntentOrder)}
					{#if blockheadIntentOrder != null}
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
				{#snippet children(blockheadWalletConnection)}
					{#if blockheadWalletConnection != null}
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
					viewSelection({
						fields: {
							walletProtocol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const walletProtocol = entity.walletProtocol}
					{#if walletProtocol != null}
						<div>
							<dt>wallet protocol</dt>
							<dd>
								{walletProtocol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							caip10: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const caip10 = entity.caip10}
					{#if caip10 != null}
						<div>
							<dt>CAIP-10</dt>
							<dd>
								<TruncatedValue value={`${caip10.namespace}:${caip10.reference}:${caip10.accountAddress}`} />
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
						resource={blockheadWalletRequest}
					>
						{#snippet children(entity)}
							{entity.requestKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>request method</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletRequest}
					>
						{#snippet children(entity)}
							{entity.requestMethod}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							chainId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const chainId = entity.chainId}
					{#if chainId != null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								<NumberValue
									value={chainId}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fromAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromAddress = entity.fromAddress}
					{#if fromAddress != null}
						<div>
							<dt>from address</dt>
							<dd>
								<TruncatedValue value={String(fromAddress)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							toAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toAddress = entity.toAddress}
					{#if toAddress != null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={String(toAddress)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							value: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const value = entity.value}
					{#if value != null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue
									value={value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							callCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const callCount = entity.callCount}
					{#if callCount != null}
						<div>
							<dt>call count</dt>
							<dd>
								<NumberValue
									value={callCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							atomicRequired: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const atomicRequired = entity.atomicRequired}
					{#if atomicRequired != null}
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
					viewSelection({
						fields: {
							requestPayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestPayloadHash = entity.requestPayloadHash}
					{#if requestPayloadHash != null}
						<div>
							<dt>request payload hash</dt>
							<dd>
								<TruncatedValue value={String(requestPayloadHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							walletCallBundleId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const walletCallBundleId = entity.walletCallBundleId}
					{#if walletCallBundleId != null}
						<div>
							<dt>wallet call bundle ID</dt>
							<dd>
								{walletCallBundleId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>requested AT</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletRequest}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.requestedAt)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							submittedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const submittedAt = entity.submittedAt}
					{#if submittedAt != null}
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
		{@const blockheadWalletRequestBlockheadWalletRequestCallsViewCallsResource = selection.$$calls}
		<ResourceBoundary
			resource={blockheadWalletRequestBlockheadWalletRequestCallsViewCallsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadWalletRequestCallsView
						selection={blockheadWalletRequestBlockheadWalletRequestCallsViewCallsResource}
						countResource={blockheadWalletRequestBlockheadWalletRequestCallsViewCallsResource.count}
						title='calls'
						id='calls'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadWalletRequestBlockheadWalletRequestTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadWalletRequestBlockheadWalletRequestTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadWalletRequest_TimestampsView
						selection={blockheadWalletRequestBlockheadWalletRequestTimestampsViewTimestampsResource}
						countResource={blockheadWalletRequestBlockheadWalletRequestTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
