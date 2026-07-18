<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'A2A agent service observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'A2aAgentService_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.A2aAgentService_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import A2aAgentService_TimestampView from '$/views/A2aAgentService_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aAgentService_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				timestampMs: true,
				health: true,
				reachable: true,
			},
		})
	}
	getResourceItems={(a2aAgentServiceTimestamps) => [...new Map(a2aAgentServiceTimestamps.values.map((a2aAgentServiceTimestamp) => [a2aAgentServiceTimestamp[EntityMetaKey.SelectorKey], a2aAgentServiceTimestamp])).values()]}
	getKey={(a2aAgentServiceTimestamp) => a2aAgentServiceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No A2A agent service observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: a2aAgentServiceTimestamp })}
		{@const a2aAgentServiceTimestampFields = { ...a2aAgentServiceTimestamp[EntityMetaKey.Selector], ...a2aAgentServiceTimestamp }}
		{@const selection = select(EntityType.A2aAgentService_Timestamp, a2aAgentServiceTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<A2aAgentService_TimestampView
			selection={selection}
			prefetched={a2aAgentServiceTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
