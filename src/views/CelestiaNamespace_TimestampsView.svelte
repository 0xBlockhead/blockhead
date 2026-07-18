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
		title = 'Celestia namespace observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CelestiaNamespace_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CelestiaNamespace_Timestamp>
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
	import CelestiaNamespace_TimestampView from '$/views/CelestiaNamespace_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaNamespace_Timestamp}
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
				height: true,
				blobCount: true,
				source: true,
			},
		})
	}
	getResourceItems={(celestiaNamespaceTimestamps) => [...new Map(celestiaNamespaceTimestamps.values.map((celestiaNamespaceTimestamp) => [celestiaNamespaceTimestamp[EntityMetaKey.SelectorKey], celestiaNamespaceTimestamp])).values()]}
	getKey={(celestiaNamespaceTimestamp) => celestiaNamespaceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Celestia namespace observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: celestiaNamespaceTimestamp })}
		{@const celestiaNamespaceTimestampFields = { ...celestiaNamespaceTimestamp[EntityMetaKey.Selector], ...celestiaNamespaceTimestamp }}
		{@const selection = select(EntityType.CelestiaNamespace_Timestamp, celestiaNamespaceTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<CelestiaNamespace_TimestampView
			selection={selection}
			prefetched={celestiaNamespaceTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
