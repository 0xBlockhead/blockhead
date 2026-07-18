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
		title = 'Celestia network observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CelestiaNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CelestiaNetwork_Timestamp>
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
	import CelestiaNetwork_TimestampView from '$/views/CelestiaNetwork_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaNetwork_Timestamp}
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
				latestHeight: true,
				health: true,
				source: true,
			},
		})
	}
	getResourceItems={(celestiaNetworkTimestamps) => [...new Map(celestiaNetworkTimestamps.values.map((celestiaNetworkTimestamp) => [celestiaNetworkTimestamp[EntityMetaKey.SelectorKey], celestiaNetworkTimestamp])).values()]}
	getKey={(celestiaNetworkTimestamp) => celestiaNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Celestia network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: celestiaNetworkTimestamp })}
		{@const celestiaNetworkTimestampFields = { ...celestiaNetworkTimestamp[EntityMetaKey.Selector], ...celestiaNetworkTimestamp }}
		{@const selection = select(EntityType.CelestiaNetwork_Timestamp, celestiaNetworkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<CelestiaNetwork_TimestampView
			selection={selection}
			prefetched={celestiaNetworkTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
