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
		id = 'CardanoScriptWitnesses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CardanoScriptWitness> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoScriptWitness}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				scriptKind: true,
				witnessIndex: true,
				scriptHash: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoScriptWitness })}
		{@const cardanoScriptWitnessSelector = cardanoScriptWitness[EntityMetaKey.Selector]}
		{@const transaction = cardanoScriptWitnessSelector.$transaction}
		<EntityView
			entityType={EntityType.CardanoScriptWitness}
			entitySelector={cardanoScriptWitnessSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/witness/[witnessIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.hash,
						witnessIndex: String(cardanoScriptWitnessSelector.witnessIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{[cardanoScriptWitness.scriptKind, 'Script #' + String(cardanoScriptWitnessSelector.witnessIndex)].filter(Boolean).join(' ') || 'Cardano script witness'}
			{/snippet}

			{#snippet Value()}
				{cardanoScriptWitness.scriptHash ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
