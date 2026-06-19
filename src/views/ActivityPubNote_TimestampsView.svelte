<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	// State
	let {
		selection,
		href,
		id,
		title = 'Metric snapshots',
		open = $bindable(false),
		sources = [
			Source.Mastodon_Rest,
			Source.Fedi_Rest,
		],
	}: {
		selection: EntityProxyEntitiesResource<typeof schema, EntityType.ActivityPubNote_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
		sources?: readonly Source[]
	} = $props()

	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary
				resource={selection({
						sources: sources,
						limit: 64,
					})}
				placeholderText="Loading metric snapshots…"
			>
				{#snippet children(activityPubNoteTimestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.ActivityPubNote_Timestamp}
						id={`${id}-items`}
						href={href}
						open={true}
						items={activityPubNoteTimestamps.entities}
					>
						{#snippet Item({ item })}
							<ActivityPubNote_TimestampView
								selection={select(EntityType.ActivityPubNote_Timestamp, item.entitySelector)}
								{href}
								layout={EntityLayout.Summary}

								showTypeAnnotation={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
