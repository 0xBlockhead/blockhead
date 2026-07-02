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
		title = 'UTXO inputs',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading UTXO inputs...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoInputs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.UtxoInput>
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
	import UtxoInputView from '$/views/UtxoInputView.svelte'
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
					$spentOutput: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoInput}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(utxoInputs)}
			{@const uniqueUtxoInputs = [...new Map(utxoInputs.values.map((utxoInput) => [utxoInput[EntityMetaKey.SelectorKey], utxoInput])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoInput}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={utxoInputs.values.length === uniqueUtxoInputs.length && utxoInputs.totalCount != null && utxoInputs.totalCount >= uniqueUtxoInputs.length ? utxoInputs.totalCount : uniqueUtxoInputs.length}
				getKey={(utxoInput) => utxoInput[EntityMetaKey.SelectorKey]}
				items={uniqueUtxoInputs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No UTXO inputs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: utxoInput }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.UtxoInput> })}
					<UtxoInputView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/input/[inputIndex=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(({ ...utxoInput.entitySelector, ...utxoInput }).$transaction.$network.caip2)].slug),
								txId: String(({ ...utxoInput.entitySelector, ...utxoInput }).$transaction.txId),
								inputIndex: String(({ ...utxoInput.entitySelector, ...utxoInput }).indexInTransaction),
							})
						}
						selection={select(EntityType.UtxoInput, utxoInput.entitySelector)}
						prefetched={utxoInput}
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
		entityType={EntityType.UtxoInput}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
