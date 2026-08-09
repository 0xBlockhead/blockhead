<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.IssuerAction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IssuerAction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: issuerAction })}
		{@const issuerActionSelector = issuerAction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IssuerAction}
			entitySelector={issuerActionSelector}
			href={
				resolve(
					'/issuer/action/[issuerActionId=stringSegment]',
					{
						issuerActionId: issuerActionSelector.issuerActionId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
