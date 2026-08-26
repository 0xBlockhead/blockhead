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
	}: Omit<EntitySelectionViewProps<EntityType.TonNftTransfer>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TonNftItemView from '$/views/TonNftItemView.svelte'
	import TonNftCollectionView from '$/views/TonNftCollectionView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import TonTraceView from '$/views/TonTraceView.svelte'
	import TonMessageView from '$/views/TonMessageView.svelte'
</script>


<EntityView
	entityType={EntityType.TonNftTransfer}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON NFT transfer'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-transfer/[transferId=stringSegment]/[source=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					transferId: selection.entitySelector.transferId,
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transfer ID</dt>
				<dd>
					{selection.entitySelector.transferId}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$item}
			>
				{#snippet children(tonNftItem)}
					{#if tonNftItem != null}
						{@const tonNftItemInitial = untrack(() => tonNftItem)}
						<div>
							<dt>item</dt>
							<dd>
								<TonNftItemView
									selection={select(EntityType.TonNftItem, (tonNftItem ?? tonNftItemInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$collection}
			>
				{#snippet children(tonNftCollection)}
					{#if tonNftCollection != null}
						{@const tonNftCollectionInitial = untrack(() => tonNftCollection)}
						<div>
							<dt>collection</dt>
							<dd>
								<TonNftCollectionView
									selection={select(EntityType.TonNftCollection, (tonNftCollection ?? tonNftCollectionInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(tonAccount)}
					{#if tonAccount != null}
						{@const tonAccountInitial = untrack(() => tonAccount)}
						<div>
							<dt>from</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, (tonAccount ?? tonAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet children(tonAccount)}
					{#if tonAccount != null}
						{@const tonAccountInitial = untrack(() => tonAccount)}
						<div>
							<dt>to</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, (tonAccount ?? tonAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$trace}
			>
				{#snippet children(tonTrace)}
					{#if tonTrace != null}
						{@const tonTraceInitial = untrack(() => tonTrace)}
						<div>
							<dt>trace</dt>
							<dd>
								<TonTraceView
									selection={select(EntityType.TonTrace, (tonTrace ?? tonTraceInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$message}
			>
				{#snippet children(tonMessage)}
					{#if tonMessage != null}
						{@const tonMessageInitial = untrack(() => tonMessage)}
						<div>
							<dt>message</dt>
							<dd>
								<TonMessageView
									selection={select(EntityType.TonMessage, (tonMessage ?? tonMessageInitial)[EntityMetaKey.Selector])}
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
							transactionLt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionLt = entity.transactionLt}
					{#if transactionLt != null}
						<div>
							<dt>transaction lt</dt>
							<dd>
								{transactionLt}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionHash = entity.transactionHash}
					{#if transactionHash != null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={transactionHash} />
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
							queryId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const queryId = entity.queryId}
					{#if queryId != null}
						<div>
							<dt>query ID</dt>
							<dd>
								{queryId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							forwardAmountNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const forwardAmountNano = entity.forwardAmountNano}
					{#if forwardAmountNano != null}
						<div>
							<dt>forward amount nano</dt>
							<dd>
								{forwardAmountNano}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							responseDestination: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const responseDestination = entity.responseDestination}
					{#if responseDestination != null}
						<div>
							<dt>response destination</dt>
							<dd>
								{responseDestination}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							customPayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const customPayloadHash = entity.customPayloadHash}
					{#if customPayloadHash != null}
						<div>
							<dt>custom payload hash</dt>
							<dd>
								<TruncatedValue value={customPayloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
