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
		title = 'UTXO blocks',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.UtxoBlock>
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
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
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
					height: true,
					hash: true,
					transactionCount: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(utxoBlocks)}
			{@const uniqueUtxoBlocks = [...new Map(utxoBlocks.values.map((utxoBlock) => [utxoBlock[EntityMetaKey.SelectorKey], utxoBlock])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoBlock}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={utxoBlocks.totalCount}
				getKey={(utxoBlock) => utxoBlock[EntityMetaKey.SelectorKey]}
				items={uniqueUtxoBlocks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No UTXO blocks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: utxoBlock }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.UtxoBlock> })}
					{@const utxoBlockFields = { ...utxoBlock[EntityMetaKey.Selector], ...utxoBlock }}
					{@const utxoBlockHrefFields = { ...utxoBlock, ...utxoBlock[EntityMetaKey.Selector] }}
					<UtxoBlockView
						selection={select(EntityType.UtxoBlock, utxoBlock[EntityMetaKey.Selector])}
						prefetched={utxoBlockFields}
						href={
							(utxoBlockHrefFields.$network !== undefined && utxoBlockHrefFields.$network.caip2 !== undefined && utxoBlockHrefFields.$network.caip2.namespace !== undefined && utxoBlockHrefFields.$network !== undefined && utxoBlockHrefFields.$network.caip2 !== undefined && utxoBlockHrefFields.$network.caip2.reference !== undefined && utxoBlockHrefFields.height !== undefined && utxoBlockHrefFields.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
								networkSlug: String(networkByCaip2[String(String(utxoBlockHrefFields.$network.caip2.namespace) + ':' + String(utxoBlockHrefFields.$network.caip2.reference))].slug ?? ''),
								height: String(utxoBlockHrefFields.height ?? ''),
								hash: String(utxoBlockHrefFields.hash ?? ''),
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
		entityType={EntityType.UtxoBlock}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
