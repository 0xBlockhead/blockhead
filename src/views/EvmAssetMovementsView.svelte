<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		id,
		open = true,
		CollapsibleProps = {},
	}: {
		selector: EntitySelector<typeof schema, EntityType.EvmTransaction>
		id: string
		open?: boolean
		CollapsibleProps?: ComponentProps<typeof EvmInternalTransfersView>['CollapsibleProps']
	} = $props()

	const evmTransaction = subscribe(EntityType.EvmTransaction,
		selector,
		({ sources: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			], fields: { value: true, $from: true, $to: true, ...(open ? ({ $$tokenTransfers: ({ sources: [
							Source.Blockscout_Rest,
							Source.Voltaire_JsonRpc,
						] }), $$internalTransfers: ({ sources: [
							Source.Blockscout_Rest,
							Source.Voltaire_JsonRpc,
						] }) }) : ({  })) } }),
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmInternalTransfersView from '$/views/EvmInternalTransfersView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<section data-column="gap-2">
	<ResourceBoundary
		resource={evmTransaction}
		placeholderText="Loading asset movements…"
	>
		{#snippet children(evmTransaction)}
			{#if evmTransaction.fields.value !== undefined && evmTransaction.fields.value > 0n}
				<div data-row="wrap gap-2 align-baseline">
					<span data-text="annotation">Signed envelope</span>
					{#if evmTransaction.fields.$from?.[EntityMetaKey.Selector].address !== undefined}
						<EvmNetworkAccountView
							selector={{
								$network: selector.$network,
								$actor: evmTransaction.fields.$from[EntityMetaKey.Selector],
							}}
							layout={EntityLayout.Title}
							open={false}
						/>
					{/if}
					<span data-text="muted">sent</span>
					<NumberValue value={evmTransaction.fields.value} />
					<span data-text="muted">to</span>
					{#if evmTransaction.fields.$to?.[EntityMetaKey.Selector].address !== undefined}
						<EvmNetworkAccountView
							selector={{
								$network: selector.$network,
								$actor: evmTransaction.fields.$to[EntityMetaKey.Selector],
							}}
							layout={EntityLayout.Title}
							open={false}
						/>
					{/if}
				</div>
			{/if}

			<EvmInternalTransfersView
				{CollapsibleProps}
				href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
					...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference },
					transactionId: selector.txHash,
					})}
				entityFieldReference={{
					entityType: EntityType.EvmTransaction,
					selector,
					fieldName: '$$internalTransfers',
				}}
				id={`${id}:internal-transfers`}
				collapsible={false}
				title="Internal native transfers"
			/>
			<EvmTokenTransfersView
				{CollapsibleProps}
				href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
					...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference },
					transactionId: selector.txHash,
					})}
				entityFieldReference={{
					entityType: EntityType.EvmTransaction,
					selector,
					fieldName: '$$tokenTransfers',
				}}
				id={`${id}:token-transfers`}
				collapsible={false}
			/>
		{/snippet}
	</ResourceBoundary>
</section>
