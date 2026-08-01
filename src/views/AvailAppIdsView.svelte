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
	}: EntityListViewProps<EntityType.AvailAppId> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvailAppId}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				appId: true,
			},
		})
	}
>
	{#snippet Item({ item: availAppId })}
		{@const availAppIdSelector = availAppId[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvailAppId}
			entitySelector={availAppIdSelector}
		>
			{#snippet Title()}
				{(availAppId.label ?? '') || String(availAppIdSelector.appId) || 'avail app ID'}
			{/snippet}

			{#snippet Value()}
				{availAppIdSelector.appId}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
