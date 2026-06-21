<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import {
		EntityProxyField,
		type EntityProxyResource,
	} from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		id,
		CollapsibleProps = {},
	}: {
		selection: EntityProxyResource<typeof schema, EntityType.EvmTransaction>
		id: string
		CollapsibleProps?: ComponentProps<typeof EvmInternalTransfersView>['CollapsibleProps']
	} = $props()


	const evmTransaction = $derived(selection({
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
		resource={evmTransaction[EntityProxyField]('value')}
		placeholderText="Loading signed envelope value…"
	>
		{#snippet children(value)}
			{#if value !== undefined && value > 0n}
				<div data-row="wrap gap-2 align-baseline">
					<span data-text="annotation">Signed envelope</span>
					<ResourceBoundary
						resource={evmTransaction.$from}
						placeholderText="Loading sender…"
					>
						{#snippet children(from)}
							{#if from?.entitySelector.address !== undefined}
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, {
										$network: selection.entitySelector.$network,
										$actor: from.entitySelector,
									})}
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
									selection={select(EntityType.EvmNetworkAccount, {
										$network: selection.entitySelector.$network,
										$actor: to.entitySelector,
									})}
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
			caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
			transactionId: selection.entitySelector.txHash,
		})}
		selection={selection.$$internalTransfers}
		id={`${id}:internal-transfers`}
		collapsible={false}
		title="Internal native transfers"
	/>
	<EvmTokenTransfersView
		{CollapsibleProps}
		href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
			caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
			transactionId: selection.entitySelector.txHash,
		})}
		selection={selection.$$tokenTransfers}
		id={`${id}:token-transfers`}
		collapsible={false}
	/>
</section>
