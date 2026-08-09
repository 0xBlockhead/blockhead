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
	}: EntityListViewProps<EntityType.ClaimTopicRequirement> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ClaimTopicRequirement}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: claimTopicRequirement })}
		{@const claimTopicRequirementSelector = claimTopicRequirement[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ClaimTopicRequirement}
			entitySelector={claimTopicRequirementSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/claim-topic/[topicKey=stringSegment]',
					{
						network: (
							'caip2' in claimTopicRequirementSelector.$profile.$assetInstance.$network ?
								caip2StringFromValue(claimTopicRequirementSelector.$profile.$assetInstance.$network.caip2)
							:
								claimTopicRequirementSelector.$profile.$assetInstance.$network.slug
						),
						kind: claimTopicRequirementSelector.$profile.$assetInstance.kind,
						assetKey: claimTopicRequirementSelector.$profile.$assetInstance.assetKey,
						topicKey: claimTopicRequirementSelector.topicKey,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
