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
		title = 'AT Protocol hub observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalAtprotoNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalAtprotoNetwork_Timestamp>
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
	import GlobalAtprotoNetwork_TimestampView from '$/views/_GlobalAtprotoNetwork_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
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
				source: true,
			},
		})
	}
	getResourceItems={(globalAtprotoNetworkTimestamps) => [...new Map(globalAtprotoNetworkTimestamps.values.map((globalAtprotoNetworkTimestamp) => [globalAtprotoNetworkTimestamp[EntityMetaKey.SelectorKey], globalAtprotoNetworkTimestamp])).values()]}
	getKey={(globalAtprotoNetworkTimestamp) => globalAtprotoNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AT Protocol hub observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalAtprotoNetworkTimestamp })}
		{@const globalAtprotoNetworkTimestampFields = { ...globalAtprotoNetworkTimestamp[EntityMetaKey.Selector], ...globalAtprotoNetworkTimestamp }}
		{@const selection = select(EntityType._GlobalAtprotoNetwork_Timestamp, globalAtprotoNetworkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<GlobalAtprotoNetwork_TimestampView
			selection={selection}
			prefetched={globalAtprotoNetworkTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
