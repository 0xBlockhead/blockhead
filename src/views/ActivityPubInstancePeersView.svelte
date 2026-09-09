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
	}: EntityListViewProps<EntityType.ActivityPubInstancePeer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubInstancePeer}
	bind:open
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
		{@const observation = activityPubInstancePeerSelector.$observation}
		<EntityView
			entityType={EntityType.ActivityPubInstancePeer}
			entitySelector={activityPubInstancePeerSelector}
			href={
				resolve(
					'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/peer/[peerDomain=stringSegment]',
					{
						instanceOrigin: encodeURIComponent(observation.$instance.instanceOrigin),
						timestampMs: String(observation.timestampMs),
						source: observation.source,
						peerDomain: activityPubInstancePeerSelector.peerDomain,
					}
				)
			}
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
