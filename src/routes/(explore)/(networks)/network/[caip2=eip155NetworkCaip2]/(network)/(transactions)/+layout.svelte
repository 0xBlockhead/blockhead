<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		children: PageChildren,
		params,
	}: {
		children: Snippet
		params: {
			caip2: `eip155:${string}`
			transactionId?: string
		}
	} = $props()

	const transaction = $derived(subscribe(EntityType.EvmTransaction,
		{
			$network: { caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } },
			txHash: ZeroExHex.assert(params.transactionId ?? ''),
		},
		({
			sources: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			],
			fields: { $block: true },
		}),
	))


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


<ParentPageCollapsible
	title="Blocks"
	href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blocks', params)}
	id={stringify({ ...{ caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } }, scope: 'blocks' })}
>
	<ResourceBoundary
		resource={transaction}
		placeholderText="Loading transaction block…"
	>
		{#snippet children(transaction)}
			{#if transaction.fields.$block?.[EntityMetaKey.Selector]}
				{@const blockEntitySelector = transaction.fields.$block[EntityMetaKey.Selector]}
				<ParentPageCollapsible
					href={resolve(
						'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber]',
						{
							caip2: params.caip2,
							blockNumber: String(blockEntitySelector.blockNumber),
						},
					)}
					id={stringify(blockEntitySelector)}
				>
					{#snippet Summary({ open: _open })}
						<EvmBlockView
							selector={blockEntitySelector}
							layout={EntityLayout.SummaryInline}
						/>
					{/snippet}

					<ParentPageCollapsible
						title="Transactions"
						href={resolve(
							`/network//block/${String(blockEntitySelector.blockNumber)}/transactions`,
						)}
						id={stringify({
							...blockEntitySelector,
							scope: 'transactions',
						})}
					>
						{@render PageChildren()}
					</ParentPageCollapsible>
				</ParentPageCollapsible>
			{:else}
				<ParentPageCollapsible
					title="Transactions"
					href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/transactions', params)}
					id={stringify({ ...{ caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } }, scope: 'transactions' })}
				>
					{@render PageChildren()}
				</ParentPageCollapsible>
			{/if}
		{/snippet}
	</ResourceBoundary>
</ParentPageCollapsible>
