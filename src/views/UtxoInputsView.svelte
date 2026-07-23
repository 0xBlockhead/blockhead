<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.UtxoInput>
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
	entityType={EntityType.UtxoInput}
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
				indexInTransaction: true,
				$spentOutput: true,
				$transaction: true,
			},
		})
	}
	{countResource}
	getResourceItems={(utxoInputs) => [...new Map(utxoInputs.values.map((utxoInput) => [utxoInput[EntityMetaKey.SelectorKey], utxoInput])).values()]}
	getKey={(utxoInput) => utxoInput[EntityMetaKey.SelectorKey]}
	{placeholderText}
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
		<EntityView
			entityType={EntityType.UtxoInput}
			entitySelector={utxoInput[EntityMetaKey.Selector]}
			href={
				(
					utxoInput[EntityMetaKey.Selector] != null && 'indexInTransaction' in utxoInput[EntityMetaKey.Selector]
					&& utxoInput[EntityMetaKey.Selector].indexInTransaction != null
					&& utxoInput[EntityMetaKey.Selector] != null && '$transaction' in utxoInput[EntityMetaKey.Selector]
					&& utxoInput[EntityMetaKey.Selector].$transaction != null && 'txId' in utxoInput[EntityMetaKey.Selector].$transaction
					&& utxoInput[EntityMetaKey.Selector].$transaction.txId != null
					&& utxoInput[EntityMetaKey.Selector].$transaction != null && '$network' in utxoInput[EntityMetaKey.Selector].$transaction ?
						utxoInput[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in utxoInput[EntityMetaKey.Selector].$transaction.$network
						&& utxoInput[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/input/[inputIndex=nonNegativeInteger]', {
						inputIndex: String(utxoInput[EntityMetaKey.Selector].indexInTransaction ?? ''),
						transactionId: String(utxoInput[EntityMetaKey.Selector].$transaction.txId ?? ''),
						network: String(caip2StringFromValue(utxoInput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
					})
					:
							utxoInput[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in utxoInput[EntityMetaKey.Selector].$transaction.$network
							&& utxoInput[EntityMetaKey.Selector].$transaction.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/input/[inputIndex=nonNegativeInteger]', {
							inputIndex: String(utxoInput[EntityMetaKey.Selector].indexInTransaction ?? ''),
							transactionId: String(utxoInput[EntityMetaKey.Selector].$transaction.txId ?? ''),
							network: String(utxoInput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{(String((utxoInputFields.indexInTransaction) ?? '') ? 'Input #' + String((utxoInputFields.indexInTransaction) ?? '') : '') || 'UTXO input'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((utxoInputFields.$spentOutput.indexInTransaction) ?? '') ? 'Output #' + String((utxoInputFields.$spentOutput.indexInTransaction) ?? '') : '') || 'UTXO output'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
