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
	}: EntityListViewProps<EntityType.IpfsResource_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IpfsResource_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					contentType: true,
					displayType: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: ipfsResourceTimestamp })}
		{@const ipfsResourceTimestampSelector = ipfsResourceTimestamp[EntityMetaKey.Selector]}
		{@const resource = ipfsResourceTimestampSelector.$resource}
		<EntityView
			entityType={EntityType.IpfsResource_Timestamp}
			entitySelector={ipfsResourceTimestampSelector}
			href={
				resource.contentPath != null
				&& resource.contentPath !== '' ?
					resolve(
						'/(explore)/(ipfs)/[namespace=ipfsNamespace]/captures/[target=stringSegment]/[timestampMs=nonNegativeInteger]/[source=stringSegment]/path/[...contentPath=stringSegment]',
						{
							namespace: resource.namespace,
							target: resource.target,
							timestampMs: String(ipfsResourceTimestampSelector.timestampMs),
							source: ipfsResourceTimestampSelector.source,
							contentPath: resource.contentPath,
						}
					)
				:
					resolve(
						'/(explore)/(ipfs)/[namespace=ipfsNamespace]/captures/[target=stringSegment]/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							namespace: resource.namespace,
							target: resource.target,
							timestampMs: String(ipfsResourceTimestampSelector.timestampMs),
							source: ipfsResourceTimestampSelector.source,
						}
					)
			}
		>
			{#snippet Title()}
				{ipfsResourceTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(ipfsResourceTimestamp.contentType ?? ''), ipfsResourceTimestamp.displayType].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
