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
	}: EntityListViewProps<EntityType.ZeroGStorageProof> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGStorageProof}
	bind:open
	resource={
		selection({
			fields: {
				proofId: true,
				$storageNode: true,
				proofKind: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGStorageProof })}
		{@const zeroGStorageProofSelector = zeroGStorageProof[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGStorageProof}
			entitySelector={zeroGStorageProofSelector}
		>
			{#snippet Title()}
				{zeroGStorageProofSelector.proofId || 'zero g storage proof'}
			{/snippet}

			{#snippet Value()}
				zero g storage node
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGStorageProof.proofKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
