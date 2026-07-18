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
		title = 'Bnb beacon token observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconToken_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BnbBeaconToken_Timestamp>
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
	import BnbBeaconToken_TimestampView from '$/views/BnbBeaconToken_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconToken_Timestamp}
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
				totalSupply: true,
				source: true,
			},
		})
	}
	getResourceItems={(bnbBeaconTokenTimestamps) => [...new Map(bnbBeaconTokenTimestamps.values.map((bnbBeaconTokenTimestamp) => [bnbBeaconTokenTimestamp[EntityMetaKey.SelectorKey], bnbBeaconTokenTimestamp])).values()]}
	getKey={(bnbBeaconTokenTimestamp) => bnbBeaconTokenTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bnb beacon token observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bnbBeaconTokenTimestamp })}
		{@const bnbBeaconTokenTimestampFields = { ...bnbBeaconTokenTimestamp[EntityMetaKey.Selector], ...bnbBeaconTokenTimestamp }}
		{@const selection = select(EntityType.BnbBeaconToken_Timestamp, bnbBeaconTokenTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BnbBeaconToken_TimestampView
			selection={selection}
			prefetched={bnbBeaconTokenTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
