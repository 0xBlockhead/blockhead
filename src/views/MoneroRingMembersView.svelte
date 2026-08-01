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
	}: EntityListViewProps<EntityType.MoneroRingMember> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroRingMember}
	bind:open
	resource={
		selection({
			fields: {
				memberIndex: true,
				globalOutputIndex: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroRingMember })}
		{@const moneroRingMemberSelector = moneroRingMember[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoneroRingMember}
			entitySelector={moneroRingMemberSelector}
		>
			{#snippet Title()}
				{moneroRingMemberSelector.memberIndex}
			{/snippet}

			{#snippet Value()}
				{moneroRingMember.globalOutputIndex ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
