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
	}: EntityListViewProps<EntityType.HederaTopicMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTopicMessage}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaTopicMessage })}
		{@const hederaTopicMessageSelector = hederaTopicMessage[EntityMetaKey.Selector]}
		{@const topic = hederaTopicMessageSelector.$topic}
		<EntityView
			entityType={EntityType.HederaTopicMessage}
			entitySelector={hederaTopicMessageSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/topic/[topicId=stringSegment]/(hederaTopic)/message/[sequenceNumber=nonNegativeBigInt]',
					{
						network: (
							topic.$network.caip2 !== undefined ?
								caip2StringFromValue(topic.$network.caip2)
							:
								topic.$network.slug
						),
						topicId: topic.topicId,
						sequenceNumber: String(hederaTopicMessageSelector.sequenceNumber),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
