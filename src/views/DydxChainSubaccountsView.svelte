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
		title = 'dYdX chain subaccounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DydxChainSubaccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.DydxChainSubaccount>
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
	import DydxChainSubaccountView from '$/views/DydxChainSubaccountView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainSubaccount}
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
				$account: true,
				subaccountNumber: true,
			},
		})
	}
	getResourceItems={(dydxChainSubaccounts) => [...new Map(dydxChainSubaccounts.values.map((dydxChainSubaccount) => [dydxChainSubaccount[EntityMetaKey.SelectorKey], dydxChainSubaccount])).values()]}
	getKey={(dydxChainSubaccount) => dydxChainSubaccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Dydx chain subaccounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: dydxChainSubaccount })}
		{@const dydxChainSubaccountFields = { ...dydxChainSubaccount[EntityMetaKey.Selector], ...dydxChainSubaccount }}
		{@const selection = select(EntityType.DydxChainSubaccount, dydxChainSubaccount[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<DydxChainSubaccountView
			selection={selection}
			prefetched={dydxChainSubaccountFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
