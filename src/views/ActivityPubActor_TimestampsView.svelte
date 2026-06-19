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
		selection: EntityProxyEntitiesResource<typeof schema, EntityType.ActivityPubActor_Timestamp>
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
	import ActivityPubActor_TimestampView from '$/views/ActivityPubActor_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.ActivityPubActor_Timestamp}
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
				{#snippet children(activityPubActorTimestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.ActivityPubActor_Timestamp}
						id={`${id}-items`}
						href={href}
						open={true}
						items={activityPubActorTimestamps.entities}
					>
						{#snippet Item({ item })}
							<ActivityPubActor_TimestampView
								selection={select(EntityType.ActivityPubActor_Timestamp, item.entitySelector)}
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
