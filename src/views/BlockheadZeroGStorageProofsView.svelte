<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead 0G storage proofs',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadZeroGStorageProof> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZeroGStorageProof}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				proofId: true,
				verified: true,
				proofKind: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadZeroGStorageProof })}
		{@const blockheadZeroGStorageProofSelector = blockheadZeroGStorageProof[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadZeroGStorageProof}
			entitySelector={blockheadZeroGStorageProofSelector}
		>
			{#snippet Title()}
				{blockheadZeroGStorageProofSelector.proofId || 'blockhead zero g storage proof'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadZeroGStorageProof.verified)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(blockheadZeroGStorageProof.proofKind ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
