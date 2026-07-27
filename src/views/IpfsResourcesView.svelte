<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.IpfsResource> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IpfsResource}
	bind:open
	resource={
		selection({
			fields: {
				canonicalUri: true,
				contentType: true,
				displayType: true,
			},
		})
	}
>
	{#snippet Item({ item: ipfsResource })}
		{@const ipfsResourceSelector = ipfsResource[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IpfsResource}
			entitySelector={ipfsResourceSelector}
			href={
				(
					ipfsResourceSelector.contentPath === '' ?
						resolve(
							'/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]',
							{
								namespace: String(ipfsResourceSelector.namespace),
								target: String(ipfsResourceSelector.target),
							}
						)
					:
						resolve(
							'/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]',
							{
								namespace: String(ipfsResourceSelector.namespace),
								target: String(ipfsResourceSelector.target),
								contentPath: String(ipfsResourceSelector.contentPath),
							}
						)
				)
			}
		>
			{#snippet Title()}
				{String(ipfsResource.canonicalUri) || 'IPFS resource'}
			{/snippet}

			{#snippet Value()}
				{[(ipfsResource.contentType ?? ''), ipfsResource.displayType].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
