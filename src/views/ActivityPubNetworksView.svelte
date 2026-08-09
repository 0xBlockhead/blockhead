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
	}: EntityListViewProps<EntityType.ActivityPubNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubNetwork}
	bind:open
	resource={
		selection({
			...{
				fields: {
					protocolName: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: activityPubNetwork })}
		<EntityView
			entityType={EntityType.ActivityPubNetwork}
			entitySelector={activityPubNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/network')}
		>
			{#snippet Title()}
				{activityPubNetwork.protocolName || 'ActivityPub'}
			{/snippet}

			{#snippet Value()}
				ActivityPub
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
