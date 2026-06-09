<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityFieldReference,
		href,
		id,
		title = 'Metric snapshots',
		open = $bindable(false),
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.YouTubeChannel_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import YouTubeChannel_TimestampView from '$/views/YouTubeChannel_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.YouTubeChannel_Timestamp}
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
			{@const parent = useEntity(entityCollectionsContext,
		entityFieldReference.entityType,
		entityFieldReference.entityId,({ sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			], fields: { [entityFieldReference.fieldName]: {
				sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				],
				limit: 64,
			},
		} }),
	)}
			{@const youTubeChannelTimestamps = derive(
		parent,
		(parent) => {
			const youTubeChannelTimestamps: readonly Entity<typeof schema, EntityType.YouTubeChannel_Timestamp>[] = (
				parent.fields[entityFieldReference.fieldName]?.values ?? []
			)
			return youTubeChannelTimestamps.map((value) => ({
				value,
			}))
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.YouTubeChannel_Timestamp}
				id={`${id}-items`}
				href={href}
				{title}
				open={true}
			>
				{#snippet Item({ item })}
						<YouTubeChannel_TimestampView
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
