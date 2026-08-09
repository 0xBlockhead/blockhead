<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadQuilibriumPendingTransaction>, 'prefetched'> = $props()

	const accountState = $derived(selection.entitySelector.$accountState)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.QuilibriumNodeRpc_Grpc,
		],
	}))
	const blockheadQuilibriumPendingTransaction = $derived(viewSelection({
		fields: {
			amount: true,
			deliveryType: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadQuilibriumAccountStateView from '$/views/BlockheadQuilibriumAccountStateView.svelte'
	import QuilibriumAccountView from '$/views/QuilibriumAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadQuilibriumPendingTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.transactionAddress || 'blockhead quilibrium pending transaction')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/account-state/[accountAddress=stringSegment]/(blockheadQuilibriumAccountState)/pending-transaction/[transactionAddress=stringSegment]',
				{
					network: (
						'caip2' in accountState.$network ?
							caip2StringFromValue(accountState.$network.caip2)
						:
							accountState.$network.slug
					),
					connectionId: accountState.connectionId,
					accountAddress: accountState.accountAddress,
					transactionAddress: selection.entitySelector.transactionAddress,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadQuilibriumPendingTransaction}>
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
		<ResourceBoundary resource={blockheadQuilibriumPendingTransaction}>
			{#snippet children(entity)}
				{@const deliveryType = entity.deliveryType}
				{#if deliveryType != null}
					<span data-text="muted">
						{deliveryType}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>account state</dt>
				<dd>
					<BlockheadQuilibriumAccountStateView
						selection={select(EntityType.BlockheadQuilibriumAccountState, selection.entitySelector.$accountState)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.transactionAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(quilibriumAccount)}
					{#if quilibriumAccount != null}
						<div>
							<dt>account</dt>
							<dd>
								<QuilibriumAccountView
									selection={select(EntityType.QuilibriumAccount, quilibriumAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$refundAccount}
			>
				{#snippet children(quilibriumAccount)}
					{#if quilibriumAccount != null}
						<div>
							<dt>refund account</dt>
							<dd>
								<QuilibriumAccountView
									selection={select(EntityType.QuilibriumAccount, quilibriumAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
							coinAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const coinAddress = entity.coinAddress}
					{#if coinAddress != null}
						<div>
							<dt>coin address</dt>
							<dd>
								<TruncatedValue value={coinAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadQuilibriumPendingTransaction}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue
									value={amount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadQuilibriumPendingTransaction}
			>
				{#snippet children(entity)}
					{@const deliveryType = entity.deliveryType}
					{#if deliveryType != null}
						<div>
							<dt>delivery type</dt>
							<dd>
								{deliveryType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							deliveryAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deliveryAddress = entity.deliveryAddress}
					{#if deliveryAddress != null}
						<div>
							<dt>delivery address</dt>
							<dd>
								<TruncatedValue value={deliveryAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							observedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedAt = entity.observedAt}
					{#if observedAt != null}
						<div>
							<dt>observed AT</dt>
							<dd>
								<Timestamp timestamp={observedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
