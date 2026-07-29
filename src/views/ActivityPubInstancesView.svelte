<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A declared Mastodon-compatible ActivityPub server observed through the shared Mastodon REST source.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ActivityPubInstance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubInstance}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				instanceOrigin: true,
			},
		})
	}
>
	{#snippet Item({ item: activityPubInstance })}
		{@const activityPubInstanceSelector = activityPubInstance[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ActivityPubInstance}
			entitySelector={activityPubInstanceSelector}
			href={
				resolve(
					'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]',
					{
						instanceOrigin: encodeURIComponent(activityPubInstanceSelector.instanceOrigin),
					}
				)
			}
		>
			{#snippet Title()}
				{activityPubInstanceSelector.instanceOrigin || 'ActivityPub instance'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
