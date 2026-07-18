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
		title = 'Transfer restriction check observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'TransferRestrictionCheck_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.TransferRestrictionCheck_Timestamp>
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
	import TransferRestrictionCheck_TimestampView from '$/views/TransferRestrictionCheck_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TransferRestrictionCheck_Timestamp}
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
	getResourceItems={(transferRestrictionCheckTimestamps) => [...new Map(transferRestrictionCheckTimestamps.values.map((transferRestrictionCheckTimestamp) => [transferRestrictionCheckTimestamp[EntityMetaKey.SelectorKey], transferRestrictionCheckTimestamp])).values()]}
	getKey={(transferRestrictionCheckTimestamp) => transferRestrictionCheckTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Transfer restriction check observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: transferRestrictionCheckTimestamp })}
		{@const transferRestrictionCheckTimestampFields = { ...transferRestrictionCheckTimestamp[EntityMetaKey.Selector], ...transferRestrictionCheckTimestamp }}
		{@const selection = select(EntityType.TransferRestrictionCheck_Timestamp, transferRestrictionCheckTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<TransferRestrictionCheck_TimestampView
			selection={selection}
			prefetched={transferRestrictionCheckTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
