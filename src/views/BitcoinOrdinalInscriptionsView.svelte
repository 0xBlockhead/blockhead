<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		<EntityView
			entityType={EntityType.BitcoinOrdinalInscription}
			entitySelector={bitcoinOrdinalInscriptionSelector}
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
