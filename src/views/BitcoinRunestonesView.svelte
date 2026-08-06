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
	}: EntityListViewProps<EntityType.BitcoinRunestone> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinRunestone}
	bind:open
	resource={
		selection({
			fields: {
				outputIndex: true,
				isCenotaph: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinRunestone })}
		{@const bitcoinRunestoneSelector = bitcoinRunestone[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitcoinRunestone}
			entitySelector={bitcoinRunestoneSelector}
		>
			{#snippet Title()}
				{bitcoinRunestoneSelector.outputIndex}
			{/snippet}

			{#snippet Value()}
				{bitcoinRunestone.isCenotaph}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
