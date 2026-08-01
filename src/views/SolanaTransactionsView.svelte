<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Transactions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SolanaTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTransaction}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				signature: true,
				status: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaTransaction })}
		{@const solanaTransactionSelector = solanaTransaction[EntityMetaKey.Selector]}
		{@const network = solanaTransactionSelector.$network}
		<EntityView
			entityType={EntityType.SolanaTransaction}
			entitySelector={solanaTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						transactionId: solanaTransactionSelector.signature,
					}
				)
			}
		>
			{#snippet Title()}
				{solanaTransactionSelector.signature || 'solana transaction'}
			{/snippet}

			{#snippet Value()}
				{solanaTransactionSelector.signature}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{solanaTransaction.status ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
