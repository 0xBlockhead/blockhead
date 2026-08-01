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
	}: EntityListViewProps<EntityType.ActivityPubActor> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubActor}
	bind:open
	resource={
		selection({
			fields: {
				instanceOrigin: true,
				localAccountId: true,
				$icon: true,
				displayName: true,
				acct: true,
				username: true,
			},
		})
	}
>
	{#snippet Item({ item: activityPubActor })}
		{@const activityPubActorSelector = activityPubActor[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ActivityPubActor}
			entitySelector={activityPubActorSelector}
			href={
				resolve(
					'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]',
					{
						instanceOrigin: encodeURIComponent(activityPubActor.instanceOrigin),
						localAccountId: activityPubActor.localAccountId,
					}
				)
			}
		>
			{#snippet Title()}
				{[(activityPubActor.displayName ?? ''), activityPubActorSelector.acct, (activityPubActor.username ?? ''), activityPubActorSelector.localAccountId].filter(Boolean).join(' ') || 'ActivityPub actor'}
			{/snippet}

			{#snippet Value()}
				{[activityPubActorSelector.acct, activityPubActorSelector.localAccountId].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
