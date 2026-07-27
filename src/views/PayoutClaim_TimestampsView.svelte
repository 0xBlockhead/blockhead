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
	}: EntityListViewProps<EntityType.PayoutClaim_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PayoutClaim_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: payoutClaimTimestamp })}
		<EntityView
			entityType={EntityType.PayoutClaim_Timestamp}
			entitySelector={payoutClaimTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				payout claim timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
