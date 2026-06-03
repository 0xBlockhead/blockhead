<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityFieldReference,
		href,
		id,
		title = 'Metric snapshots',
		open = $bindable(false),
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.YouTubePlaylist_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import YouTubePlaylist_TimestampView from '$/views/YouTubePlaylist_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.YouTubePlaylist_Timestamp}
	{href}
	{id}
	bind:open
	{title}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Timestamped social metric snapshots captured from provider-visible counters.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
			[entityFieldReference.fieldName]: {
				$: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				],
				$limit: 64,
			},
		},
	)}
			{@const youTubePlaylistTimestamps = derive(
		parent,
		(parent) => {
			const youTubePlaylistTimestamps: Entity<typeof schema, EntityType.YouTubePlaylist_Timestamp>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			return youTubePlaylistTimestamps.map((value) => ({
				value,
			}))
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.YouTubePlaylist_Timestamp}
				id={`${id}-items`}
				href={href}
				{title}
				open={true}
			>
				{#snippet Item({ item })}
						<YouTubePlaylist_TimestampView
							entityId={item.value[EntityMetaKey.Id]}
							{href}
							layout={EntityLayout.Summary}
							open={false}
							showTypeAnnotation={false}
						/>
					{/snippet}

			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
