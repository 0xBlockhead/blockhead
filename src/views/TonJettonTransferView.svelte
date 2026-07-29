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
	}: EntitySelectionViewProps<EntityType.TonJettonTransfer> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TonJettonView from '$/views/TonJettonView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import TonTraceView from '$/views/TonTraceView.svelte'
	import TonMessageView from '$/views/TonMessageView.svelte'
</script>


<EntityView
	entityType={EntityType.TonJettonTransfer}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON jetton transfer'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		TON jetton transfer
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
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
				resource={selection.$jetton}
			>
				{#snippet children(tonJetton)}
					{#if tonJetton != null}
						<div>
							<dt>jetton</dt>
							<dd>
								<TonJettonView
									selection={select(EntityType.TonJetton, tonJetton[EntityMetaKey.Selector])}
									prefetched={tonJetton}
									layout={EntityLayout.Value}
									open={false}
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
									prefetched={tonAccount}
									layout={EntityLayout.Value}
									open={false}
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
									prefetched={tonAccount}
									layout={EntityLayout.Value}
									open={false}
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
									prefetched={tonTrace}
									layout={EntityLayout.Value}
									open={false}
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
									prefetched={tonMessage}
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
							amountNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountNano = entity.amountNano}
					{#if amountNano != null}
						<div>
							<dt>amount nano</dt>
							<dd>
								{amountNano}
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
							forwardTonAmountNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const forwardTonAmountNano = entity.forwardTonAmountNano}
					{#if forwardTonAmountNano != null}
						<div>
							<dt>forward TON amount nano</dt>
							<dd>
								{forwardTonAmountNano}
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
