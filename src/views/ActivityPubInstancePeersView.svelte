<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A domain that a declared ActivityPub instance reports as a known connected domain.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ActivityPubInstancePeer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubInstancePeer}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				peerDomain: true,
				$observation: {
					fields: {
						title: true,
						$instance: true,
						version: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: activityPubInstancePeer })}
		{@const activityPubInstancePeerSelector = activityPubInstancePeer[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ActivityPubInstancePeer}
			entitySelector={activityPubInstancePeerSelector}
		>
			{#snippet Title()}
				{activityPubInstancePeerSelector.peerDomain || 'ActivityPub instance peer'}
			{/snippet}

			{#snippet Value()}
				{[(activityPubInstancePeer.$observation.title ?? ''), String(activityPubInstancePeerSelector.$observation.timestampMs)].filter(Boolean).join(' ') || 'ActivityPub instance observation'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
