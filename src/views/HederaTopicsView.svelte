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
	}: EntityListViewProps<EntityType.HederaTopic> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTopic}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaTopic })}
		{@const hederaTopicSelector = hederaTopic[EntityMetaKey.Selector]}
		{@const network = hederaTopicSelector.$network}
		<EntityView
			entityType={EntityType.HederaTopic}
			entitySelector={hederaTopicSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/topic/[topicId=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						topicId: hederaTopicSelector.topicId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
