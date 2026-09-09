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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AptosTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosTransaction}
	bind:open
	resource={
		selection({
			fields: {
				hash: true,
				transactionKind: true,
				version: true,
				sender: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosTransaction })}
		{@const aptosTransactionSelector = aptosTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosTransaction}
			entitySelector={aptosTransactionSelector}
			href={
				'version' in aptosTransactionSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/version/[version=nonNegativeBigInt]',
						{
							network: (
								'caip2' in aptosTransactionSelector.$network.$network ?
									caip2StringFromValue(aptosTransactionSelector.$network.$network.caip2)
								:
									aptosTransactionSelector.$network.$network.slug
							),
							version: String(aptosTransactionSelector.version),
						}
					)
				:
					'hash' in aptosTransactionSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
							{
								network: (
									'caip2' in aptosTransactionSelector.$network.$network ?
										caip2StringFromValue(aptosTransactionSelector.$network.$network.caip2)
									:
										aptosTransactionSelector.$network.$network.slug
								),
								transactionId: aptosTransactionSelector.hash,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{aptosTransaction.hash || String(aptosTransaction.version) || 'aptos transaction'}
			{/snippet}

			{#snippet Value()}
				{aptosTransaction.transactionKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosTransaction.sender ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
