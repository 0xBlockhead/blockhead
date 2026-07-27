<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.DogecoinAuxPowParentBlockHeader> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DogecoinAuxPowParentBlockHeader}
	bind:open
	resource={
		selection({
			fields: {
				$auxPow: true,
				merkleRoot: true,
			},
		})
	}
>
	{#snippet Item({ item: dogecoinAuxPowParentBlockHeader })}
		{@const dogecoinAuxPowParentBlockHeaderSelector = dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DogecoinAuxPowParentBlockHeader}
			entitySelector={dogecoinAuxPowParentBlockHeaderSelector}
		>
			{#snippet Title()}
				{((String(dogecoinAuxPowParentBlockHeaderSelector.$auxPow.$block.height ?? '') ? 'Block #' + String(dogecoinAuxPowParentBlockHeaderSelector.$auxPow.$block.height ?? '') : '') || (dogecoinAuxPowParentBlockHeaderSelector.$auxPow.$block.hash ?? '') || 'UTXO block')}
			{/snippet}

			{#snippet Value()}
				{(dogecoinAuxPowParentBlockHeader.merkleRoot ?? '')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
