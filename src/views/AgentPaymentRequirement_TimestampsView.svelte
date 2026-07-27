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
	}: EntityListViewProps<EntityType.AgentPaymentRequirement_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AgentPaymentRequirement_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: agentPaymentRequirementTimestamp })}
		<EntityView
			entityType={EntityType.AgentPaymentRequirement_Timestamp}
			entitySelector={agentPaymentRequirementTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				agent payment requirement timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
