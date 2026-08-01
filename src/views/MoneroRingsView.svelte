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
	}: EntityListViewProps<EntityType.MoneroRing> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroRing}
	bind:open
	resource={
		selection({
			fields: {
				$keyImage: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroRing })}
		{@const moneroRingSelector = moneroRing[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoneroRing}
			entitySelector={moneroRingSelector}
		>
			{#snippet Title()}
				{moneroRingSelector.$keyImage.keyImage || 'monero key image'}
			{/snippet}

			{#snippet Value()}
				Ring
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
