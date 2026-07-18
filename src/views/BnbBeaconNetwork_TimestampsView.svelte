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
		title = 'Bnb beacon network observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BnbBeaconNetwork_Timestamp>
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
	import BnbBeaconNetwork_TimestampView from '$/views/BnbBeaconNetwork_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconNetwork_Timestamp}
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
				latestArchivedHeight: true,
				archiveCoverageStatus: true,
				source: true,
			},
		})
	}
	getResourceItems={(bnbBeaconNetworkTimestamps) => [...new Map(bnbBeaconNetworkTimestamps.values.map((bnbBeaconNetworkTimestamp) => [bnbBeaconNetworkTimestamp[EntityMetaKey.SelectorKey], bnbBeaconNetworkTimestamp])).values()]}
	getKey={(bnbBeaconNetworkTimestamp) => bnbBeaconNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bnb beacon network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bnbBeaconNetworkTimestamp })}
		{@const bnbBeaconNetworkTimestampFields = { ...bnbBeaconNetworkTimestamp[EntityMetaKey.Selector], ...bnbBeaconNetworkTimestamp }}
		{@const selection = select(EntityType.BnbBeaconNetwork_Timestamp, bnbBeaconNetworkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BnbBeaconNetwork_TimestampView
			selection={selection}
			prefetched={bnbBeaconNetworkTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
