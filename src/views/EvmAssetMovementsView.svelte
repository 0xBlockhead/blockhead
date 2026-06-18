<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		id,
		CollapsibleProps = {},
	}: {
		selector: EntitySelector<typeof schema, EntityType.EvmTransaction>
		id: string
		CollapsibleProps?: ComponentProps<typeof EvmInternalTransfersView>['CollapsibleProps']
	} = $props()

	const evmTransaction = $derived(select(
		EntityType.EvmTransaction,
		selector,
		{
			sources: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			],
		},
	))
	
	
	



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
		resource={evmTransaction.field('value')}
		placeholderText="Loading signed envelope value…"
	>
		{#snippet children(value)}
			{#if value > 0n}
				<div data-row="wrap gap-2 align-baseline">
					<span data-text="annotation">Signed envelope</span>
					<ResourceBoundary
						resource={evmTransaction.$from}
						placeholderText="Loading sender…"
					>
						{#snippet children(from)}
							{#if from?.entitySelector.address !== undefined}
								<EvmNetworkAccountView
									selector={{
										$network: selector.$network,
										$actor: from.entitySelector,
									}}
									layout={EntityLayout.Title}

									open={false}
									/>
							{/if}
						{/snippet}
					</ResourceBoundary>
					<span data-text="muted">sent</span>
					<NumberValue value={value} />
					<span data-text="muted">to</span>
					<ResourceBoundary
						resource={evmTransaction.$to}
						placeholderText="Loading recipient…"
					>
						{#snippet children(to)}
							{#if to?.entitySelector.address !== undefined}
								<EvmNetworkAccountView
									selector={{
										$network: selector.$network,
										$actor: to.entitySelector,
									}}
									layout={EntityLayout.Title}

									open={false}
									/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</div>
			{/if}
		{/snippet}
	</ResourceBoundary>

	<EvmInternalTransfersView
		{CollapsibleProps}
		href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
			caip2: `${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`,
			transactionId: selector.txHash,
		})}
		selection={select(
			EntityType.EvmTransaction,
			selector
		).$$internalTransfers}
		id={`${id}:internal-transfers`}
		collapsible={false}
		title="Internal native transfers"
	/>
	<EvmTokenTransfersView
		{CollapsibleProps}
		href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
			caip2: `${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`,
			transactionId: selector.txHash,
		})}
		selection={select(
			EntityType.EvmTransaction,
			selector
		).$$tokenTransfers}
		id={`${id}:token-transfers`}
		collapsible={false}
	/>
</section>
