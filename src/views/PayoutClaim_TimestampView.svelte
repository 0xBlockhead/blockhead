<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.PayoutClaim_Timestamp>, 'prefetched'> = $props()

	const payout = $derived(selection.entitySelector.$payout)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PayoutView from '$/views/PayoutView.svelte'
	import AccountView from '$/views/AccountView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.PayoutClaim_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/payout/[payoutSource=stringSegment]/[payoutId=stringSegment]/(payout)/claim/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					payoutSource: payout.source,
					payoutId: payout.payoutId,
					namespace: selection.entitySelector.$account.caip10.namespace,
					reference: selection.entitySelector.$account.caip10.reference,
					accountAddress: selection.entitySelector.$account.caip10.accountAddress,
					timestampMs: String(selection.entitySelector.timestampMs),
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
				<dt>payout</dt>
				<dd>
					<PayoutView
						selection={select(EntityType.Payout, selection.entitySelector.$payout)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>account</dt>
				<dd>
					<AccountView
						selection={select(EntityType.Account, selection.entitySelector.$account)}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							eligibleAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const eligibleAmount = entity.eligibleAmount}
					{#if eligibleAmount != null}
						<div>
							<dt>eligible amount</dt>
							<dd>
								{eligibleAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							claimedAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const claimedAmount = entity.claimedAmount}
					{#if claimedAmount != null}
						<div>
							<dt>claimed amount</dt>
							<dd>
								{claimedAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							claimStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const claimStatus = entity.claimStatus}
					{#if claimStatus != null}
						<div>
							<dt>claim status</dt>
							<dd>
								{claimStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proofHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proofHash = entity.proofHash}
					{#if proofHash != null}
						<div>
							<dt>proof hash</dt>
							<dd>
								<TruncatedValue value={proofHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$claimTransaction}
			>
				{#snippet children(evmTransaction)}
					{#if evmTransaction != null}
						{@const evmTransactionInitial = untrack(() => evmTransaction)}
						<div>
							<dt>claim transaction</dt>
							<dd>
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, (evmTransaction ?? evmTransactionInitial)[EntityMetaKey.Selector])}
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
							expiresAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expiresAt = entity.expiresAt}
					{#if expiresAt != null}
						<div>
							<dt>expires AT</dt>
							<dd>
								<Timestamp timestamp={expiresAt} />
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
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
