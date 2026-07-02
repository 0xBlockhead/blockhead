<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Bitcoin Cash CashToken categories',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Bitcoin Cash CashToken categories...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitcoinCashCashTokenCategories-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BitcoinCashCashTokenCategory>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BitcoinCashCashTokenCategoryView from '$/views/BitcoinCashCashTokenCategoryView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					categoryId: true,
					$network: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitcoinCashCashTokenCategory}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(bitcoinCashCashTokenCategories)}
			{@const uniqueBitcoinCashCashTokenCategories = [...new Map(bitcoinCashCashTokenCategories.values.map((bitcoinCashCashTokenCategory) => [bitcoinCashCashTokenCategory[EntityMetaKey.SelectorKey], bitcoinCashCashTokenCategory])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitcoinCashCashTokenCategory}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bitcoinCashCashTokenCategories.values.length === uniqueBitcoinCashCashTokenCategories.length && bitcoinCashCashTokenCategories.totalCount != null && bitcoinCashCashTokenCategories.totalCount >= uniqueBitcoinCashCashTokenCategories.length ? bitcoinCashCashTokenCategories.totalCount : uniqueBitcoinCashCashTokenCategories.length}
				getKey={(bitcoinCashCashTokenCategory) => bitcoinCashCashTokenCategory[EntityMetaKey.SelectorKey]}
				items={uniqueBitcoinCashCashTokenCategories}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bitcoin Cash CashToken categories yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bitcoinCashCashTokenCategory }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BitcoinCashCashTokenCategory> })}
					<BitcoinCashCashTokenCategoryView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/cash-token/category/[categoryId]', {
								networkSlug: String(({ ...bitcoinCashCashTokenCategory.entitySelector, ...bitcoinCashCashTokenCategory }).$network.slug),
								categoryId: String(({ ...bitcoinCashCashTokenCategory.entitySelector, ...bitcoinCashCashTokenCategory }).categoryId),
							})
						}
						selection={select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory.entitySelector)}
						prefetched={bitcoinCashCashTokenCategory}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BitcoinCashCashTokenCategory}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
