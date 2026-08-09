<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.HederaTopic_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTopic_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaTopicTimestamp })}
		{@const hederaTopicTimestampSelector = hederaTopicTimestamp[EntityMetaKey.Selector]}
		{@const topic = hederaTopicTimestampSelector.$topic}
		<EntityView
			entityType={EntityType.HederaTopic_Timestamp}
			entitySelector={hederaTopicTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/topic/[topicId=stringSegment]/(hederaTopic)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in topic.$network ?
								caip2StringFromValue(topic.$network.caip2)
							:
								topic.$network.slug
						),
						topicId: topic.topicId,
						timestampMs: String(hederaTopicTimestampSelector.timestampMs),
						source: hederaTopicTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
