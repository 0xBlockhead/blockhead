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
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TronTokenTransfer>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TronTransactionView from '$/views/TronTransactionView.svelte'
	import TronTokenView from '$/views/TronTokenView.svelte'
	import TronAccountView from '$/views/TronAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.TronTokenTransfer}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transaction/[transactionId=stringSegment]/transfer/[transferIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					transactionId: selection.entitySelector.transactionId,
					transferIndex: String(selection.entitySelector.transferIndex),
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
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Transaction ID</dt>
				<dd>
					{selection.entitySelector.transactionId}
				</dd>
			</div>

			<div>
				<dt>Transfer index</dt>
				<dd>
					{selection.entitySelector.transferIndex}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet children(tronTransaction)}
					{#if tronTransaction != null}
						{@const tronTransactionInitial = untrack(() => tronTransaction)}
						<div>
							<dt>Transaction</dt>
							<dd>
								<TronTransactionView
									selection={select(EntityType.TronTransaction, (tronTransaction ?? tronTransactionInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$token}
			>
				{#snippet children(tronToken)}
					{#if tronToken != null}
						{@const tronTokenInitial = untrack(() => tronToken)}
						<div>
							<dt>Token</dt>
							<dd>
								<TronTokenView
									selection={select(EntityType.TronToken, (tronToken ?? tronTokenInitial)[EntityMetaKey.Selector])}
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
							standard: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const standard = entity.standard}
					{#if standard != null}
						<div>
							<dt>Standard</dt>
							<dd>
								{standard}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(tronAccount)}
					{#if tronAccount != null}
						{@const tronAccountInitial = untrack(() => tronAccount)}
						<div>
							<dt>From</dt>
							<dd>
								<TronAccountView
									selection={select(EntityType.TronAccount, (tronAccount ?? tronAccountInitial)[EntityMetaKey.Selector])}
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
				{#snippet children(tronAccount)}
					{#if tronAccount != null}
						{@const tronAccountInitial = untrack(() => tronAccount)}
						<div>
							<dt>To</dt>
							<dd>
								<TronAccountView
									selection={select(EntityType.TronAccount, (tronAccount ?? tronAccountInitial)[EntityMetaKey.Selector])}
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
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>Amount</dt>
							<dd>
								{amount}
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
		</dl>
	{/snippet}
</EntityView>
