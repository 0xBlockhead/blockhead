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
		title = 'UTXO outputs',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoOutputs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.UtxoOutput>
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
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
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
					indexInTransaction: true,
					$address: true,
					isSpent: true,
					$transaction: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoOutput}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(utxoOutputs)}
			{@const uniqueUtxoOutputs = [...new Map(utxoOutputs.values.map((utxoOutput) => [utxoOutput[EntityMetaKey.SelectorKey], utxoOutput])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoOutput}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={utxoOutputs.totalCount}
				getKey={(utxoOutput) => utxoOutput[EntityMetaKey.SelectorKey]}
				items={uniqueUtxoOutputs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No UTXO outputs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: utxoOutput }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.UtxoOutput> })}
					{@const utxoOutputFields = { ...utxoOutput[EntityMetaKey.Selector], ...utxoOutput }}
					{@const utxoOutputHrefFields = { ...utxoOutput, ...utxoOutput[EntityMetaKey.Selector] }}
					<UtxoOutputView
						selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
						prefetched={utxoOutputFields}
						href={
							(utxoOutputHrefFields.$transaction !== undefined && utxoOutputHrefFields.$transaction.$network !== undefined && utxoOutputHrefFields.$transaction.$network.caip2 !== undefined && utxoOutputHrefFields.$transaction.$network.caip2.namespace !== undefined && utxoOutputHrefFields.$transaction !== undefined && utxoOutputHrefFields.$transaction.$network !== undefined && utxoOutputHrefFields.$transaction.$network.caip2 !== undefined && utxoOutputHrefFields.$transaction.$network.caip2.reference !== undefined && utxoOutputHrefFields.$transaction !== undefined && utxoOutputHrefFields.$transaction.txId !== undefined && utxoOutputHrefFields.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(String(utxoOutputHrefFields.$transaction.$network.caip2.namespace) + ':' + String(utxoOutputHrefFields.$transaction.$network.caip2.reference))].slug ?? ''),
								txId: String(utxoOutputHrefFields.$transaction.txId ?? ''),
								outputIndex: String(utxoOutputHrefFields.indexInTransaction ?? ''),
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
		entityType={EntityType.UtxoOutput}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
