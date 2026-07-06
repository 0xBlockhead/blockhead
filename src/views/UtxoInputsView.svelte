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
		placeholderText,
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
			selection({
				fields: {
					indexInTransaction: true,
					$spentOutput: true,
					$transaction: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={utxoInputs.totalCount}
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
					{@const utxoInputFields = { ...utxoInput[EntityMetaKey.Selector], ...utxoInput }}
					{@const utxoInputHrefFields = { ...utxoInput, ...utxoInput[EntityMetaKey.Selector] }}
					<UtxoInputView
						selection={select(EntityType.UtxoInput, utxoInput[EntityMetaKey.Selector])}
						prefetched={utxoInputFields}
						href={
							(utxoInputHrefFields.$transaction !== undefined && utxoInputHrefFields.$transaction.$network !== undefined && utxoInputHrefFields.$transaction.$network.caip2 !== undefined && utxoInputHrefFields.$transaction.$network.caip2.namespace !== undefined && utxoInputHrefFields.$transaction !== undefined && utxoInputHrefFields.$transaction.$network !== undefined && utxoInputHrefFields.$transaction.$network.caip2 !== undefined && utxoInputHrefFields.$transaction.$network.caip2.reference !== undefined && utxoInputHrefFields.$transaction !== undefined && utxoInputHrefFields.$transaction.txId !== undefined && utxoInputHrefFields.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/input/[inputIndex=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(String(utxoInputHrefFields.$transaction.$network.caip2.namespace) + ':' + String(utxoInputHrefFields.$transaction.$network.caip2.reference))].slug ?? ''),
								txId: String(utxoInputHrefFields.$transaction.txId ?? ''),
								inputIndex: String(utxoInputHrefFields.indexInTransaction ?? ''),
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
		entityType={EntityType.UtxoInput}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
