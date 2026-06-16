<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		href,
		id,
		title = 'Metric snapshots',
		open = $bindable(false),
		sources = [
			Source.Mastodon_Rest,
			Source.Fedi_Rest,
		],
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.ActivityPubNote_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
		sources?: readonly Source[]
	} = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ActivityPubNote_TimestampView from '$/views/ActivityPubNote_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.ActivityPubNote_Timestamp}
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ sources, fields: { [entityFieldReference.fieldName]: {
						sources,
						limit: 64,
					},
				} }),
			)}
			{@const activityPubNoteTimestamps = derive(
				parent,
				(parent) => {
					const activityPubNoteTimestamps: readonly Entity<typeof schema, EntityType.ActivityPubNote_Timestamp>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return activityPubNoteTimestamps.map((value) => ({
						value,
					}))
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.ActivityPubNote_Timestamp}
				id={`${id}-items`}
				href={href}
				open={true}
				resource={activityPubNoteTimestamps}
			>
				{#snippet Item({ item })}
					<ActivityPubNote_TimestampView
						selector={item.value[EntityMetaKey.Selector]}
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
