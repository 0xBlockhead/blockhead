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
		id = 'DogecoinAuxPowMerkleBranches-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DogecoinAuxPowMerkleBranch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DogecoinAuxPowMerkleBranch}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				branchKind: true,
				$auxPow: true,
			},
		})
	}
>
	{#snippet Item({ item: dogecoinAuxPowMerkleBranch })}
		{@const dogecoinAuxPowMerkleBranchSelector = dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DogecoinAuxPowMerkleBranch}
			entitySelector={dogecoinAuxPowMerkleBranchSelector}
		>
			{#snippet Title()}
				{dogecoinAuxPowMerkleBranchSelector.branchKind || 'dogecoin aux pow merkle branch'}
			{/snippet}

			{#snippet Value()}
				{((String(dogecoinAuxPowMerkleBranchSelector.$auxPow.$block.height ?? '') ? 'Block #' + String(dogecoinAuxPowMerkleBranchSelector.$auxPow.$block.height ?? '') : '') || (dogecoinAuxPowMerkleBranchSelector.$auxPow.$block.hash ?? '') || 'UTXO block')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
