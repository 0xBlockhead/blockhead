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
	}: EntityListViewProps<EntityType.ActivityPubInstance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubInstance_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				timestampMs: true,
				$instance: true,
				source: true,
				version: true,
			},
		})
	}
>
	{#snippet Item({ item: activityPubInstanceTimestamp })}
		{@const activityPubInstanceTimestampSelector = activityPubInstanceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ActivityPubInstance_Timestamp}
			entitySelector={activityPubInstanceTimestampSelector}
			href={
				resolve(
					'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						instanceOrigin: encodeURIComponent(activityPubInstanceTimestampSelector.$instance.instanceOrigin),
						timestampMs: String(activityPubInstanceTimestampSelector.timestampMs),
						source: activityPubInstanceTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(activityPubInstanceTimestamp.title ?? ''), String(activityPubInstanceTimestampSelector.timestampMs)].filter(Boolean).join(' ') || 'ActivityPub instance observation'}
			{/snippet}

			{#snippet Value()}
				{[activityPubInstanceTimestampSelector.$instance.instanceOrigin || 'ActivityPub instance', activityPubInstanceTimestampSelector.source, (activityPubInstanceTimestamp.version ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
