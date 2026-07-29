<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadBridgeTransaction> = $props()

	const sourceTx = $derived(selection.entitySelector.$sourceTx)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadBridgeTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.createdAt)}
	href={
		href === undefined ?
			(
				'caip2' in sourceTx.$network ?
					resolve(
						'/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]',
						{
							chainId: sourceTx.$network.caip2.reference,
							address: selection.entitySelector.$account.address,
							sourceTxHash: encodeURIComponent(sourceTx.txHash),
							createdAt: String(selection.entitySelector.createdAt),
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.createdAt} />
	{/snippet}

	{#snippet Value()}
		<EvmTransactionView
			selection={select(EntityType.EvmTransaction, selection.entitySelector.$sourceTx)}
			href={null}
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EvmAccountView
				selection={select(EntityType.EvmAccount, selection.entitySelector.$account)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Source transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$sourceTx)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.createdAt} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$bridgeTransfer}
			>
				{#snippet children(bridgeTransfer)}
					{#if bridgeTransfer != null}
						<div>
							<dt>Bridge transfer</dt>
							<dd>
								<BridgeTransferView
									selection={select(EntityType.BridgeTransfer, bridgeTransfer[EntityMetaKey.Selector])}
									prefetched={bridgeTransfer}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
