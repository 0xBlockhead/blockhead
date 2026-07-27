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
	}: EntityListViewProps<EntityType.HederaTokenCustomFee> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTokenCustomFee}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaTokenCustomFee })}
		<EntityView
			entityType={EntityType.HederaTokenCustomFee}
			entitySelector={hederaTokenCustomFee[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera token custom fee
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
