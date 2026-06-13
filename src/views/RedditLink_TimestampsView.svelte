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
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.RedditLink_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import RedditLink_TimestampView from '$/views/RedditLink_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RedditLink_Timestamp}
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
		entityFieldReference.entityId,({ sources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			], fields: { [entityFieldReference.fieldName]: {
				sources: [
					Source.Reddit_Rest,
					Source.Reddit_PublicJson,
				],
				limit: 64,
			},
		} }),
	)}
			{@const redditLinkTimestamps = derive(
		parent,
		(parent) => {
			const redditLinkTimestamps: readonly Entity<typeof schema, EntityType.RedditLink_Timestamp>[] = (
				parent.fields[entityFieldReference.fieldName]?.values ?? []
			)
			return redditLinkTimestamps.map((value) => ({
				value,
			}))
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.RedditLink_Timestamp}
				id={`${id}-items`}
				href={href}
				{title}
				open={true}
			>
				{#snippet Item({ item })}
						<RedditLink_TimestampView
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
