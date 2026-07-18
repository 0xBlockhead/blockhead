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
		title = 'Hedera token association observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HederaTokenAssociation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.HederaTokenAssociation_Timestamp>
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
	import HederaTokenAssociation_TimestampView from '$/views/HederaTokenAssociation_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTokenAssociation_Timestamp}
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
	getResourceItems={(hederaTokenAssociationTimestamps) => [...new Map(hederaTokenAssociationTimestamps.values.map((hederaTokenAssociationTimestamp) => [hederaTokenAssociationTimestamp[EntityMetaKey.SelectorKey], hederaTokenAssociationTimestamp])).values()]}
	getKey={(hederaTokenAssociationTimestamp) => hederaTokenAssociationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Hedera token association observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: hederaTokenAssociationTimestamp })}
		{@const hederaTokenAssociationTimestampFields = { ...hederaTokenAssociationTimestamp[EntityMetaKey.Selector], ...hederaTokenAssociationTimestamp }}
		{@const selection = select(EntityType.HederaTokenAssociation_Timestamp, hederaTokenAssociationTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<HederaTokenAssociation_TimestampView
			selection={selection}
			prefetched={hederaTokenAssociationTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
