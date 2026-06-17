<script lang="ts">
import { stringify } from 'devalue'
	// Types/constants
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	// State
	let {
		entityFieldReference,
		href,
		id,
		title = 'Metric snapshots',
		open = $bindable(false),
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.LensAccount_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()

	import { proxy } from '$/routes/+layout.svelte'


	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LensAccount_TimestampView from '$/views/LensAccount_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.LensAccount_Timestamp}
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
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
						{
							sources: [Source.Lens_Graphql],
						}
					).field(entityFieldReference.fieldName, {
						sources: [Source.Lens_Graphql],
						limit: 64,
					})}
				placeholderText="Loading metric snapshots…"
			>
				{#snippet children(lensAccountTimestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.LensAccount_Timestamp}
						id={`${id}-items`}
						href={href}
						{title}
						items={lensAccountTimestamps.entities}
						open={true}
					>
						{#snippet Item({ item })}
							<LensAccount_TimestampView
								selector={item.entitySelector}
								{href}
								id={stringify(item.entitySelector)}
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
