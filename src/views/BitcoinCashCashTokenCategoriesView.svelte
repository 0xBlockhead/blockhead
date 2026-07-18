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
		title = 'Bitcoin Cash CashToken categories',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitcoinCashCashTokenCategories-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BitcoinCashCashTokenCategory>
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
	import BitcoinCashCashTokenCategoryView from '$/views/BitcoinCashCashTokenCategoryView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinCashCashTokenCategory}
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
				categoryId: true,
				$network: true,
			},
		})
	}
	getResourceItems={(bitcoinCashCashTokenCategories) => [...new Map(bitcoinCashCashTokenCategories.values.map((bitcoinCashCashTokenCategory) => [bitcoinCashCashTokenCategory[EntityMetaKey.SelectorKey], bitcoinCashCashTokenCategory])).values()]}
	getKey={(bitcoinCashCashTokenCategory) => bitcoinCashCashTokenCategory[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bitcoin Cash CashToken categories yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitcoinCashCashTokenCategory })}
		{@const bitcoinCashCashTokenCategoryFields = { ...bitcoinCashCashTokenCategory[EntityMetaKey.Selector], ...bitcoinCashCashTokenCategory }}
		{@const selection = select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BitcoinCashCashTokenCategoryView
			selection={selection}
			prefetched={bitcoinCashCashTokenCategoryFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
