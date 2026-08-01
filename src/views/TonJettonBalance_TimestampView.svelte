<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.TonJettonBalance_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import TonJettonView from '$/views/TonJettonView.svelte'
</script>


<EntityView
	entityType={EntityType.TonJettonBalance_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON jetton balance timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<TonAccountView
						selection={select(EntityType.TonAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>jetton</dt>
				<dd>
					<TonJettonView
						selection={select(EntityType.TonJetton, selection.entitySelector.$jetton)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							jettonWalletAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const jettonWalletAddress = entity.jettonWalletAddress}
					{#if jettonWalletAddress != null}
						<div>
							<dt>jetton wallet address</dt>
							<dd>
								<TruncatedValue value={jettonWalletAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							balanceNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balanceNano = entity.balanceNano}
					{#if balanceNano != null}
						<div>
							<dt>balance nano</dt>
							<dd>
								{balanceNano}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ownerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ownerAddress = entity.ownerAddress}
					{#if ownerAddress != null}
						<div>
							<dt>owner address</dt>
							<dd>
								<TruncatedValue value={ownerAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							masterAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const masterAddress = entity.masterAddress}
					{#if masterAddress != null}
						<div>
							<dt>master address</dt>
							<dd>
								<TruncatedValue value={masterAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastTransactionLt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastTransactionLt = entity.lastTransactionLt}
					{#if lastTransactionLt != null}
						<div>
							<dt>last transaction lt</dt>
							<dd>
								{lastTransactionLt}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							locked: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const locked = entity.locked}
					{#if locked != null}
						<div>
							<dt>locked</dt>
							<dd>
								{locked ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
