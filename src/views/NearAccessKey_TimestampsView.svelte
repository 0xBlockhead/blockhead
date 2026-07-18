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
		title = 'Near access key observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NearAccessKey_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NearAccessKey_Timestamp>
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
	import NearAccessKey_TimestampView from '$/views/NearAccessKey_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearAccessKey_Timestamp}
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
				permission: true,
				blockHeight: true,
			},
		})
	}
	getResourceItems={(nearAccessKeyTimestamps) => [...new Map(nearAccessKeyTimestamps.values.map((nearAccessKeyTimestamp) => [nearAccessKeyTimestamp[EntityMetaKey.SelectorKey], nearAccessKeyTimestamp])).values()]}
	getKey={(nearAccessKeyTimestamp) => nearAccessKeyTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Near access key observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nearAccessKeyTimestamp })}
		{@const nearAccessKeyTimestampFields = { ...nearAccessKeyTimestamp[EntityMetaKey.Selector], ...nearAccessKeyTimestamp }}
		{@const selection = select(EntityType.NearAccessKey_Timestamp, nearAccessKeyTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<NearAccessKey_TimestampView
			selection={selection}
			prefetched={nearAccessKeyTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
