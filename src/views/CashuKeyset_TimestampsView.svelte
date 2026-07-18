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
		title = 'Cashu keyset observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CashuKeyset_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CashuKeyset_Timestamp>
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
	import CashuKeyset_TimestampView from '$/views/CashuKeyset_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CashuKeyset_Timestamp}
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
				active: true,
				inputFeePpk: true,
			},
		})
	}
	getResourceItems={(cashuKeysetTimestamps) => [...new Map(cashuKeysetTimestamps.values.map((cashuKeysetTimestamp) => [cashuKeysetTimestamp[EntityMetaKey.SelectorKey], cashuKeysetTimestamp])).values()]}
	getKey={(cashuKeysetTimestamp) => cashuKeysetTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cashu keyset observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cashuKeysetTimestamp })}
		{@const cashuKeysetTimestampFields = { ...cashuKeysetTimestamp[EntityMetaKey.Selector], ...cashuKeysetTimestamp }}
		{@const selection = select(EntityType.CashuKeyset_Timestamp, cashuKeysetTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<CashuKeyset_TimestampView
			selection={selection}
			prefetched={cashuKeysetTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
