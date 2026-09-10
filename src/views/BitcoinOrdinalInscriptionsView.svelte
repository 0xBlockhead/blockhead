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
	}: EntityListViewProps<EntityType.BitcoinOrdinalInscription> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinOrdinalInscription}
	bind:open
	resource={
		selection({
			fields: {
				inscriptionId: true,
				contentType: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinOrdinalInscription })}
		{@const bitcoinOrdinalInscriptionSelector = bitcoinOrdinalInscription[EntityMetaKey.Selector]}
		{@const network = bitcoinOrdinalInscriptionSelector.$network}
		<EntityView
			entityType={EntityType.BitcoinOrdinalInscription}
			entitySelector={bitcoinOrdinalInscriptionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/inscription/[inscriptionId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						inscriptionId: bitcoinOrdinalInscriptionSelector.inscriptionId,
					}
				)
			}
		>
			{#snippet Title()}
				{bitcoinOrdinalInscriptionSelector.inscriptionId || 'Bitcoin Ordinal inscription'}
			{/snippet}

			{#snippet Value()}
				{bitcoinOrdinalInscription.contentType ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
