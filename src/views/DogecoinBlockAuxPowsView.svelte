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
	}: EntityListViewProps<EntityType.DogecoinBlockAuxPow> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DogecoinBlockAuxPow}
	bind:open
	resource={
		selection({
			fields: {
				$block: true,
				$parentBlockHeader: true,
			},
		})
	}
>
	{#snippet Item({ item: dogecoinBlockAuxPow })}
		{@const dogecoinBlockAuxPowSelector = dogecoinBlockAuxPow[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DogecoinBlockAuxPow}
			entitySelector={dogecoinBlockAuxPowSelector}
		>
			{#snippet Title()}
				{`Block #${dogecoinBlockAuxPowSelector.$block.height}`}
			{/snippet}

			{#snippet Value()}
				{dogecoinBlockAuxPow.$parentBlockHeader == null ? '' : 'dogecoin aux pow parent block header'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
