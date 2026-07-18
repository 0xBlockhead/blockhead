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
		title = 'Kaspa accepted transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'KaspaAcceptedTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.KaspaAcceptedTransaction>
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
	import KaspaAcceptedTransactionView from '$/views/KaspaAcceptedTransactionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaAcceptedTransaction}
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
	getResourceItems={(kaspaAcceptedTransactions) => [...new Map(kaspaAcceptedTransactions.values.map((kaspaAcceptedTransaction) => [kaspaAcceptedTransaction[EntityMetaKey.SelectorKey], kaspaAcceptedTransaction])).values()]}
	getKey={(kaspaAcceptedTransaction) => kaspaAcceptedTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Kaspa accepted transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: kaspaAcceptedTransaction })}
		{@const kaspaAcceptedTransactionFields = { ...kaspaAcceptedTransaction[EntityMetaKey.Selector], ...kaspaAcceptedTransaction }}
		{@const selection = select(EntityType.KaspaAcceptedTransaction, kaspaAcceptedTransaction[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<KaspaAcceptedTransactionView
			selection={selection}
			prefetched={kaspaAcceptedTransactionFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
