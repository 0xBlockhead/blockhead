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
		title = 'Radicle signed ref observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RadicleSignedRef_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.RadicleSignedRef_Timestamp>
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
	import RadicleSignedRef_TimestampView from '$/views/RadicleSignedRef_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleSignedRef_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	getResourceItems={(radicleSignedRefTimestamps) => [...new Map(radicleSignedRefTimestamps.values.map((radicleSignedRefTimestamp) => [radicleSignedRefTimestamp[EntityMetaKey.SelectorKey], radicleSignedRefTimestamp])).values()]}
	getKey={(radicleSignedRefTimestamp) => radicleSignedRefTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Radicle signed ref observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: radicleSignedRefTimestamp })}
		{@const radicleSignedRefTimestampFields = { ...radicleSignedRefTimestamp[EntityMetaKey.Selector], ...radicleSignedRefTimestamp }}
		{@const selection = select(EntityType.RadicleSignedRef_Timestamp, radicleSignedRefTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<RadicleSignedRef_TimestampView
			selection={selection}
			prefetched={radicleSignedRefTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
