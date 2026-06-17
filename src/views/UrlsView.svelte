<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		fieldSources,
		title = 'URLs',
		emptyText = 'No URLs in this urls yet.',
		open = $bindable(true),
		enrich = true,
		id,
		limit,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Url>
			fieldSources: readonly Source[]
			title?: string
			emptyText?: string
			open?: boolean
			enrich?: boolean
			id: string
			limit?: number
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import UrlView from '$/views/UrlView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Url}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Each row is a normal HTTPS (or similar) link, usually enriched from page metadata when available.
			</p>
			<p>
				This is separate from Swarm <code>bzz</code> addresses, on-chain topics, pool contracts, or chat threads.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: fieldSources,
						limit: limit ?? undefined,
					})}
				placeholderText="Loading urls…"
			>
				{#snippet children(urls)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Url}
				id={`${id}-items`}
				href={href}
				{title}
				getKey={(envelope) => envelope.entitySelector.url}
				getSortValue={(envelope) => envelope.entitySelector.url}
				items={urls.entities}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
							<p data-text="muted">
								{emptyText}
							</p>
						{/snippet}

				{#snippet Item({ item: envelope })}
							{#if enrich}
								<UrlView
									selector={envelope.entitySelector}
									layout={EntityLayout.Summary}

								/>
							{:else}
								<span data-text="font-monospace">
									{envelope.entitySelector.url}
								</span>
							{/if}
						{/snippet}

			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
