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
	}: EntityListViewProps<EntityType.SwarmResource> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SwarmResource}
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
	{#snippet Item({ item: swarmResource })}
		{@const swarmResourceSelector = swarmResource[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SwarmResource}
			entitySelector={swarmResourceSelector}
			href={
				(
					swarmResourceSelector.contentPath === '' ?
						resolve(
							'/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]',
							{
								reference: String(swarmResourceSelector.reference),
							}
						)
					:
						resolve(
							'/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]/path/[...contentPath=stringSegment]',
							{
								reference: String(swarmResourceSelector.reference),
								contentPath: String(swarmResourceSelector.contentPath),
							}
						)
				)
			}
		>
			{#snippet Title()}
				{String(swarmResource.canonicalUri) || 'Swarm resource'}
			{/snippet}

			{#snippet Value()}
				{[(swarmResource.contentType ?? ''), swarmResource.displayType].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
