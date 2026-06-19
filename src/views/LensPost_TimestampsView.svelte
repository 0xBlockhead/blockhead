<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
import { stringify } from 'devalue'
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
	}: {
		selection: EntityProxyEntitiesResource<typeof schema, EntityType.LensPost_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()



	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LensPost_TimestampView from '$/views/LensPost_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.LensPost_Timestamp}
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
						sources: [Source.Lens_Graphql],
						limit: 64,
					})}
				placeholderText="Loading metric snapshots…"
			>
				{#snippet children(lensPostTimestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.LensPost_Timestamp}
						id={`${id}-items`}
						href={href}
						{title}
						items={lensPostTimestamps.entities}
						open={true}
					>
						{#snippet Item({ item })}
							<LensPost_TimestampView
								selection={select(EntityType.LensPost_Timestamp, item.entitySelector)}
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
