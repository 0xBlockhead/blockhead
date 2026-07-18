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
		title = 'Arweave hub observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalArweaveNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalArweaveNetwork_Timestamp>
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
	import GlobalArweaveNetwork_TimestampView from '$/views/_GlobalArweaveNetwork_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalArweaveNetwork_Timestamp}
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
				sourceReportedLatestHeight: true,
				reachable: true,
			},
		})
	}
	getResourceItems={(globalArweaveNetworkTimestamps) => [...new Map(globalArweaveNetworkTimestamps.values.map((globalArweaveNetworkTimestamp) => [globalArweaveNetworkTimestamp[EntityMetaKey.SelectorKey], globalArweaveNetworkTimestamp])).values()]}
	getKey={(globalArweaveNetworkTimestamp) => globalArweaveNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global Arweave network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalArweaveNetworkTimestamp })}
		{@const globalArweaveNetworkTimestampFields = { ...globalArweaveNetworkTimestamp[EntityMetaKey.Selector], ...globalArweaveNetworkTimestamp }}
		{@const selection = select(EntityType._GlobalArweaveNetwork_Timestamp, globalArweaveNetworkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<GlobalArweaveNetwork_TimestampView
			selection={selection}
			prefetched={globalArweaveNetworkTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
