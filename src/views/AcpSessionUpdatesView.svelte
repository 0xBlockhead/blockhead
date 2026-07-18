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
		title = 'ACP session updates',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AcpSessionUpdates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AcpSessionUpdate>
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
	import AcpSessionUpdateView from '$/views/AcpSessionUpdateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpSessionUpdate}
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
				sequence: true,
				updateKind: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(acpSessionUpdates) => [...new Map(acpSessionUpdates.values.map((acpSessionUpdate) => [acpSessionUpdate[EntityMetaKey.SelectorKey], acpSessionUpdate])).values()]}
	getKey={(acpSessionUpdate) => acpSessionUpdate[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ACP session updates yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: acpSessionUpdate })}
		{@const acpSessionUpdateFields = { ...acpSessionUpdate[EntityMetaKey.Selector], ...acpSessionUpdate }}
		{@const selection = select(EntityType.AcpSessionUpdate, acpSessionUpdate[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AcpSessionUpdateView
			selection={selection}
			prefetched={acpSessionUpdateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
