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
	}: EntityListViewProps<EntityType.XrplTrustline_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplTrustline_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplTrustlineTimestamp })}
		<EntityView
			entityType={EntityType.XrplTrustline_Timestamp}
			entitySelector={xrplTrustlineTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				XRPL trustline timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
