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
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Bitcoin Cash CashToken categories',
		typeAnnotationParagraphs = [],
		placeholderText,
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
			selection({
				fields: {
					categoryId: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
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
				totalCount={bitcoinCashCashTokenCategories.totalCount}
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
					{@const bitcoinCashCashTokenCategoryFields = { ...bitcoinCashCashTokenCategory[EntityMetaKey.Selector], ...bitcoinCashCashTokenCategory }}
					{@const bitcoinCashCashTokenCategoryHrefFields = { ...bitcoinCashCashTokenCategory, ...bitcoinCashCashTokenCategory[EntityMetaKey.Selector] }}
					<BitcoinCashCashTokenCategoryView
						selection={select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory[EntityMetaKey.Selector])}
						prefetched={bitcoinCashCashTokenCategoryFields}
						href={
							(bitcoinCashCashTokenCategoryHrefFields.$network !== undefined && bitcoinCashCashTokenCategoryHrefFields.$network.caip2 !== undefined && bitcoinCashCashTokenCategoryHrefFields.$network.caip2.namespace !== undefined && bitcoinCashCashTokenCategoryHrefFields.$network !== undefined && bitcoinCashCashTokenCategoryHrefFields.$network.caip2 !== undefined && bitcoinCashCashTokenCategoryHrefFields.$network.caip2.reference !== undefined && bitcoinCashCashTokenCategoryHrefFields.categoryId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/cash-token/category/[categoryId]', {
								networkSlug: String(networkByCaip2[String(String(bitcoinCashCashTokenCategoryHrefFields.$network.caip2.namespace) + ':' + String(bitcoinCashCashTokenCategoryHrefFields.$network.caip2.reference))].slug ?? ''),
								categoryId: String(bitcoinCashCashTokenCategoryHrefFields.categoryId ?? ''),
							}) : undefined)
						}
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
