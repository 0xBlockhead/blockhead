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
		placeholderText = 'Loading UTXO outputs...',
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
			selection.sources == null ? selection({
				fields: {
					indexInTransaction: true,
					$address: true,
					isSpent: true,
				},
			}) : selection
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
				totalCount={utxoOutputs.values.length === uniqueUtxoOutputs.length && utxoOutputs.totalCount != null && utxoOutputs.totalCount >= uniqueUtxoOutputs.length ? utxoOutputs.totalCount : uniqueUtxoOutputs.length}
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
					<UtxoOutputView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(({ ...utxoOutput.entitySelector, ...utxoOutput }).$transaction.$network.caip2)].slug),
								txId: String(({ ...utxoOutput.entitySelector, ...utxoOutput }).$transaction.txId),
								outputIndex: String(({ ...utxoOutput.entitySelector, ...utxoOutput }).indexInTransaction),
							})
						}
						selection={select(EntityType.UtxoOutput, utxoOutput.entitySelector)}
						prefetched={utxoOutput}
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
