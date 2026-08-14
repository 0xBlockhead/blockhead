<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SafeMultisigTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SafeMultisigTransaction}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.SafeTransactionService_Rest,
				],
				fields: {
					safeTxHash: true,
					operation: true,
					isExecuted: true,
					$safe: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: safeMultisigTransaction })}
		{@const safeMultisigTransactionSelector = safeMultisigTransaction[EntityMetaKey.Selector]}
		{@const network = safeMultisigTransactionSelector.$network}
		<EntityView
			entityType={EntityType.SafeMultisigTransaction}
			entitySelector={safeMultisigTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/safe-tx/[safeTxHash=evmTxHash]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						safeTxHash: safeMultisigTransactionSelector.safeTxHash,
					}
				)
			}
		>
			{#snippet Title()}
				{safeMultisigTransactionSelector.safeTxHash || 'Safe transaction'}
			{/snippet}

			{#snippet Value()}
				{[safeMultisigTransaction.operation, String(safeMultisigTransaction.isExecuted)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(safeMultisigTransaction.$safe.precompileName ?? ''), safeMultisigTransaction.$safe.address].filter(Boolean).join(' ') || 'EVM contract'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
