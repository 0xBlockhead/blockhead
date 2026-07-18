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
		title = 'Filecoin message receipts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FilecoinMessageReceipts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FilecoinMessageReceipt>
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
	import FilecoinMessageReceiptView from '$/views/FilecoinMessageReceiptView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessageReceipt}
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
				tipsetKey: true,
				exitCode: true,
				gasUsed: true,
			},
		})
	}
	getResourceItems={(filecoinMessageReceipts) => [...new Map(filecoinMessageReceipts.values.map((filecoinMessageReceipt) => [filecoinMessageReceipt[EntityMetaKey.SelectorKey], filecoinMessageReceipt])).values()]}
	getKey={(filecoinMessageReceipt) => filecoinMessageReceipt[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Filecoin message receipts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: filecoinMessageReceipt })}
		{@const filecoinMessageReceiptFields = { ...filecoinMessageReceipt[EntityMetaKey.Selector], ...filecoinMessageReceipt }}
		{@const selection = select(EntityType.FilecoinMessageReceipt, filecoinMessageReceipt[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<FilecoinMessageReceiptView
			selection={selection}
			prefetched={filecoinMessageReceiptFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
