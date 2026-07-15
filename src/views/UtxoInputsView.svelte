<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'UTXO inputs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoInputs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.UtxoInput>
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

				{#snippet Item({ item: utxoInput })}
					{@const utxoInputFields = { ...utxoInput[EntityMetaKey.Selector], ...utxoInput }}
					{@const selection = select(EntityType.UtxoInput, utxoInput[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const utxoInputHrefFields = { ...utxoInput, ...utxoInput[EntityMetaKey.Selector] }}
					<UtxoInputView
						selection={selection}
						prefetched={utxoInputFields}
						href={
							(utxoInputHrefFields.indexInTransaction !== undefined && utxoInputHrefFields.$transaction !== undefined && utxoInputHrefFields.$transaction.txId !== undefined && utxoInputHrefFields.$transaction.$network !== undefined && utxoInputHrefFields.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/input/[inputIndex=nonNegativeInteger]', {
								inputIndex: String(utxoInputHrefFields.indexInTransaction ?? ''),
								transactionId: String(utxoInputHrefFields.$transaction.txId ?? ''),
								network: String(caip2StringFromValue(utxoInputHrefFields.$transaction.$network.caip2) ?? ''),
							}) : utxoInputHrefFields.indexInTransaction !== undefined && utxoInputHrefFields.$transaction !== undefined && utxoInputHrefFields.$transaction.txId !== undefined && utxoInputHrefFields.$transaction.$network !== undefined && utxoInputHrefFields.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/input/[inputIndex=nonNegativeInteger]', {
								inputIndex: String(utxoInputHrefFields.indexInTransaction ?? ''),
								transactionId: String(utxoInputHrefFields.$transaction.txId ?? ''),
								network: String(utxoInputHrefFields.$transaction.$network.slug ?? ''),
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
