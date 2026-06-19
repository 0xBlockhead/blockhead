<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
			selection,
			href,
		title = 'Bridge transaction',
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BridgeTransaction>
			href?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeTransaction}
	bind:open
	entitySelector={selection.entitySelector}
	href={href ?? resolve('/~/(accounts)/accounts/(transactions)/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash]/[createdAt]', {
		chainId: String(evmChainIdFromCaip2(`${selection.entitySelector.$sourceTx.$network.caip2.namespace}:${selection.entitySelector.$sourceTx.$network.caip2.reference}`)),
		address: selection.entitySelector.$account.address,
		sourceTxHash: selection.entitySelector.$sourceTx.txHash,
		createdAt: String(selection.entitySelector.createdAt),
	})}
	{title}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.$sourceTx.txHash}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		{title}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Origin-chain bridge records usually bridgeTransactions the depositor, source network, and the transaction that locked or burned funds on that side.
		</p>
		<p>
			Final delivery, relayer proofs, and refunds settle on the destination ledger and in the bridge’s own lifecycle rules—always verify both chains and the protocol’s status pages.
		</p>
	{/snippet}

	{#snippet Content({})}
		<div data-column="gap-1">
			<dl data-column-item="center">
				<div>
					<dt>Origin chain</dt>
					<dd>
						<EvmNetworkView
							selection={select(EntityType.EvmNetwork, selection.entitySelector.$sourceTx.$network)}
							layout={EntityLayout.Title}

						/>
					</dd>
				</div>
				<div>
					<dt>Origin transaction</dt>
					<dd>
						<EvmTransactionView
							selection={select(EntityType.EvmTransaction, selection.entitySelector.$sourceTx)}
							href={resolve(
								'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]',
								{
										caip2: `${selection.entitySelector.$sourceTx.$network.caip2.namespace}:${selection.entitySelector.$sourceTx.$network.caip2.reference}`,
										transactionId: selection.entitySelector.$sourceTx.txHash,
								},
							)}
							layout={EntityLayout.Title}

						/>
					</dd>
				</div>
				<div>
					<dt>Recorded at</dt>
					<dd>
						<Timestamp
							timestamp={selection.entitySelector.createdAt}
						/>
					</dd>
				</div>
				{#if open}
					<div>
						<dt>Initiator</dt>
						<dd>
							<EvmNetworkAccountView
								selection={select(EntityType.EvmNetworkAccount, {
									$network: selection.entitySelector.$sourceTx.$network,
									$actor: selection.entitySelector.$account,
								})}
								layout={EntityLayout.Title}

							/>
						</dd>
					</div>
				{/if}
			</dl>
		</div>
	{/snippet}
</EntityView>
