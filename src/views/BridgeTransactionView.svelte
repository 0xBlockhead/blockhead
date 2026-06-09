<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
			entityId,
			href = resolve('/~/(accounts)/accounts/(transactions)/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]', {
				chainId: String(evmChainIdFromCaip2(`${entityId.$sourceTx.$network.caip2.namespace}:${entityId.$sourceTx.$network.caip2.reference}`)),
				address: entityId.$account.address,
				sourceTxHash: entityId.$sourceTx.txHash,
				createdAt: String(entityId.createdAt),
			}),
		title = 'Bridge transaction',
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BridgeTransaction>
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
	{entityId}
	href={href}
	{title}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.$sourceTx.txHash}
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
							entityId={entityId.$sourceTx.$network}
							layout={EntityLayout.Title}
							open={false}
						/>
					</dd>
				</div>
				<div>
					<dt>Origin transaction</dt>
					<dd>
						<EvmTransactionView
							entityId={entityId.$sourceTx}
							href={resolve(
								'/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]',
								{
										...{ caip2Namespace: entityId.$sourceTx.$network.caip2.namespace, caip2Reference: entityId.$sourceTx.$network.caip2.reference },
										transactionId: entityId.$sourceTx.txHash,
								},
							)}
							layout={EntityLayout.Title}
							open={false}
						/>
					</dd>
				</div>
				<div>
					<dt>Recorded at</dt>
					<dd>
						<Timestamp
							timestamp={entityId.createdAt}
						/>
					</dd>
				</div>
				{#if open}
					<div>
						<dt>Initiator</dt>
						<dd>
							<EvmNetworkAccountView
								entityId={{
									$network: entityId.$sourceTx.$network,
									$actor: entityId.$account,
								}}
								layout={EntityLayout.Title}
								open={false}
							/>
						</dd>
					</div>
				{/if}
			</dl>
		</div>
	{/snippet}
</EntityView>
