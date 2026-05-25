<script lang="ts">
	// Types/constants
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		params,
	} = $props()

	const transactionEntityId = $derived(
		{
			$network: { chainId: Number(params.networkId) },
			txHash: params.transactionId as `0x${string}`,
		},
	)

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const transaction = useEntity(
		EntityType.EvmTransaction,
		transactionEntityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			],
			$block: {},
		},
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


<ParentPageCollapsible
	title={'Blocks'}
	href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blocks', params)}
	id={stringify({ chainId: Number(params.networkId), scope: 'blocks' })}
>
	<ResourceBoundary
		resource={transaction}
		placeholderText="Loading transaction block…"
	>
		{#snippet children(transaction)}
			{#if transaction.$block?.[EntityMetaKey.Id]}
				{@const blockEntityId = transaction.$block[EntityMetaKey.Id]}
				<ParentPageCollapsible
					href={resolve(
						'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
						{
						networkId: params.networkId,
						blockNumber: String(blockEntityId.blockNumber),
						},
					)}
					id={stringify(blockEntityId)}
				>
					{#snippet Summary({ open: _open })}
						<EvmBlockView
							entityId={blockEntityId}
							layout={EntityLayout.SummaryInline}
						/>
					{/snippet}

					<ParentPageCollapsible
						title={'Transactions'}
						href={resolve(
							`/network/${params.networkId}/block/${String(blockEntityId.blockNumber)}/transactions`,
						)}
						id={stringify({
							...blockEntityId,
							scope: 'transactions',
						})}
					>
						{@render children()}
					</ParentPageCollapsible>
				</ParentPageCollapsible>
			{:else}
				<ParentPageCollapsible
					title={'Transactions'}
					href={resolve('/(explore)/(networks)/network/[networkId]/(network)/transactions', params)}
					id={stringify({ chainId: Number(params.networkId), scope: 'transactions' })}
				>
					{@render children()}
				</ParentPageCollapsible>
			{/if}
		{/snippet}
	</ResourceBoundary>
</ParentPageCollapsible>
