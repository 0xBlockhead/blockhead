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
	}: EntityListViewProps<EntityType.ActivityPubActor_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubActor_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$actor: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: activityPubActorTimestamp })}
		{@const activityPubActorTimestampSelector = activityPubActorTimestamp[EntityMetaKey.Selector]}
		{@const actor = activityPubActorTimestampSelector.$actor}
		<EntityView
			entityType={EntityType.ActivityPubActor_Timestamp}
			entitySelector={activityPubActorTimestampSelector}
			href={
				'instanceOrigin' in actor
				&& 'localAccountId' in actor ?
					resolve(
						'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							instanceOrigin: encodeURIComponent(actor.instanceOrigin),
							localAccountId: actor.localAccountId,
							timestampMs: String(activityPubActorTimestampSelector.timestampMs),
							source: activityPubActorTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{[(activityPubActorTimestamp.$actor.displayName ?? ''), activityPubActorTimestampSelector.$actor.acct, (activityPubActorTimestamp.$actor.username ?? ''), activityPubActorTimestampSelector.$actor.localAccountId].filter(Boolean).join(' ') || 'ActivityPub actor'}
			{/snippet}

			{#snippet Value()}
				{activityPubActorTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
