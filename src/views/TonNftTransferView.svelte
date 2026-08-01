<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TonNftTransfer>, 'prefetched'> = $props()


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
						<div>
							<dt>item</dt>
							<dd>
								<TonNftItemView
									selection={select(EntityType.TonNftItem, tonNftItem[EntityMetaKey.Selector])}
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
						<div>
							<dt>collection</dt>
							<dd>
								<TonNftCollectionView
									selection={select(EntityType.TonNftCollection, tonNftCollection[EntityMetaKey.Selector])}
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
						<div>
							<dt>from</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, tonAccount[EntityMetaKey.Selector])}
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
						<div>
							<dt>to</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, tonAccount[EntityMetaKey.Selector])}
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
						<div>
							<dt>trace</dt>
							<dd>
								<TonTraceView
									selection={select(EntityType.TonTrace, tonTrace[EntityMetaKey.Selector])}
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
						<div>
							<dt>message</dt>
							<dd>
								<TonMessageView
									selection={select(EntityType.TonMessage, tonMessage[EntityMetaKey.Selector])}
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
