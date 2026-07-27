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
	}: EntityListViewProps<EntityType.StellarClaimableBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarClaimableBalance_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarClaimableBalanceTimestamp })}
		<EntityView
			entityType={EntityType.StellarClaimableBalance_Timestamp}
			entitySelector={stellarClaimableBalanceTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				stellar claimable balance timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
