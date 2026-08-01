<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.SolanaTokenAccount_Timestamp> = $props()

	const solanaTokenAccountTimestamp = $derived(selection({
		fields: {
			amount: true,
			timestampMs: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaTokenAccountView from '$/views/SolanaTokenAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTokenAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.slot)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.slot}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaTokenAccountTimestamp}>
			{#snippet children(entity)}
				{@const amount = entity.amount}
				{#if amount != null}
					<NumberValue
						value={amount}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTokenAccountTimestamp}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<span data-text="muted">
						<Timestamp timestamp={timestampMs} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Token account</dt>
				<dd>
					<SolanaTokenAccountView
						selection={select(EntityType.SolanaTokenAccount, selection.entitySelector.$tokenAccount)}
						layout={EntityLayout.Value}
					/>
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
							decimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const decimals = entity.decimals}
					{#if decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{decimals}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							uiAmountString: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const uiAmountString = entity.uiAmountString}
					{#if uiAmountString != null}
						<div>
							<dt>UI amount</dt>
							<dd>
								{uiAmountString}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							state: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const state = entity.state}
					{#if state != null}
						<div>
							<dt>State</dt>
							<dd>
								{state}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isNative: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isNative = entity.isNative}
					{#if isNative != null}
						<div>
							<dt>Native</dt>
							<dd>
								{isNative ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatedAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegatedAmount = entity.delegatedAmount}
					{#if delegatedAmount != null}
						<div>
							<dt>Delegated amount</dt>
							<dd>
								{delegatedAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rentExemptReserveLamports: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rentExemptReserveLamports = entity.rentExemptReserveLamports}
					{#if rentExemptReserveLamports != null}
						<div>
							<dt>Rent exempt reserve</dt>
							<dd>
								{rentExemptReserveLamports}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ownerPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ownerPubkey = entity.ownerPubkey}
					{#if ownerPubkey != null}
						<div>
							<dt>Owner public key</dt>
							<dd>
								{ownerPubkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mintAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mintAddress = entity.mintAddress}
					{#if mintAddress != null}
						<div>
							<dt>Mint address</dt>
							<dd>
								<TruncatedValue value={mintAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatePubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegatePubkey = entity.delegatePubkey}
					{#if delegatePubkey != null}
						<div>
							<dt>Delegate public key</dt>
							<dd>
								{delegatePubkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closeAuthorityPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const closeAuthorityPubkey = entity.closeAuthorityPubkey}
					{#if closeAuthorityPubkey != null}
						<div>
							<dt>Close authority public key</dt>
							<dd>
								{closeAuthorityPubkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
