<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.TonTransactionPhase>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TonTransactionView from '$/views/TonTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.TonTransactionPhase}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON transaction phase'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]/(tonTransaction)/phase/[phaseKind=stringSegment]',
				{
					network: (
						'caip2' in transaction.$account.$network ?
							caip2StringFromValue(transaction.$account.$network.caip2)
						:
							transaction.$account.$network.slug
					),
					accountId: transaction.$account.address,
					lt: String(transaction.lt),
					phaseKind: selection.entitySelector.phaseKind,
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
				<dt>transaction</dt>
				<dd>
					<TonTransactionView
						selection={select(EntityType.TonTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>phase kind</dt>
				<dd>
					{selection.entitySelector.phaseKind}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							success: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const success = entity.success}
					{#if success != null}
						<div>
							<dt>success</dt>
							<dd>
								{success ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							exitCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const exitCode = entity.exitCode}
					{#if exitCode != null}
						<div>
							<dt>exit code</dt>
							<dd>
								{exitCode}
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
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>gas used</dt>
							<dd>
								{gasUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasFeesNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasFeesNano = entity.gasFeesNano}
					{#if gasFeesNano != null}
						<div>
							<dt>gas fees nano</dt>
							<dd>
								{gasFeesNano}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageFeesNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storageFeesNano = entity.storageFeesNano}
					{#if storageFeesNano != null}
						<div>
							<dt>storage fees nano</dt>
							<dd>
								{storageFeesNano}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							actionResultCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const actionResultCode = entity.actionResultCode}
					{#if actionResultCode != null}
						<div>
							<dt>action result code</dt>
							<dd>
								{actionResultCode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							skippedReason: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const skippedReason = entity.skippedReason}
					{#if skippedReason != null}
						<div>
							<dt>skipped reason</dt>
							<dd>
								{skippedReason}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
