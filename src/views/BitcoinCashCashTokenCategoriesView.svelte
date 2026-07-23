<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BitcoinCashCashTokenCategory>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenCategory}
			entitySelector={bitcoinCashCashTokenCategory[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bitcoinCashCashTokenCategoryFields.categoryId) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken category'}
			{/snippet}

			{#snippet Value()}
				{[String((bitcoinCashCashTokenCategoryFields.categoryId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((bitcoinCashCashTokenCategoryFields.$network.name) ?? '')].filter(Boolean).join(' ') || [bitcoinCashCashTokenCategoryFields.$network.caip2 == null ? '' : String(`${(bitcoinCashCashTokenCategoryFields.$network.caip2).namespace}:${(bitcoinCashCashTokenCategoryFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
