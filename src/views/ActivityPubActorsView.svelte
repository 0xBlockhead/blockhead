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
			...{
				fields: {
					$icon: true,
					displayName: true,
					acct: true,
					username: true,
					localAccountId: true,
				},
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
				'instanceOrigin' in activityPubActorSelector
				&& 'localAccountId' in activityPubActorSelector ?
					resolve(
						'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]',
						{
							instanceOrigin: encodeURIComponent(activityPubActorSelector.instanceOrigin),
							localAccountId: activityPubActorSelector.localAccountId,
						}
					)
				:
					'instanceOrigin' in activityPubActorSelector
					&& 'acct' in activityPubActorSelector ?
						resolve(
							'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/@[acct=stringSegment]',
							{
								instanceOrigin: encodeURIComponent(activityPubActorSelector.instanceOrigin),
								acct: activityPubActorSelector.acct,
							}
						)
					:
						'activityStreamsUri' in activityPubActorSelector ?
							resolve(
								'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[activityStreamsUri=stringSegment]',
								{
									activityStreamsUri: activityPubActorSelector.activityStreamsUri,
								}
							)
						:
							undefined
			}
		>
			{#snippet Title()}
				{[(activityPubActor.displayName ?? ''), activityPubActor.acct, (activityPubActor.username ?? ''), activityPubActor.localAccountId].filter(Boolean).join(' ') || 'ActivityPub actor'}
			{/snippet}

			{#snippet Value()}
				{[activityPubActor.acct, activityPubActor.localAccountId].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
