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
		title = 'UTXO outputs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoOutputs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.UtxoOutput>
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
	entityType={EntityType.UtxoOutput}
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
				$address: true,
				isSpent: true,
				$transaction: true,
			},
		})
	}
	{countResource}
	getResourceItems={(utxoOutputs) => [...new Map(utxoOutputs.values.map((utxoOutput) => [utxoOutput[EntityMetaKey.SelectorKey], utxoOutput])).values()]}
	getKey={(utxoOutput) => utxoOutput[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No UTXO outputs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: utxoOutput })}
		{@const utxoOutputFields = { ...utxoOutput[EntityMetaKey.Selector], ...utxoOutput }}
		<EntityView
			entityType={EntityType.UtxoOutput}
			entitySelector={utxoOutput[EntityMetaKey.Selector]}
			href={
				(
					utxoOutput[EntityMetaKey.Selector] != null && 'indexInTransaction' in utxoOutput[EntityMetaKey.Selector]
					&& utxoOutput[EntityMetaKey.Selector].indexInTransaction != null
					&& utxoOutput[EntityMetaKey.Selector] != null && '$transaction' in utxoOutput[EntityMetaKey.Selector]
					&& utxoOutput[EntityMetaKey.Selector].$transaction != null && 'txId' in utxoOutput[EntityMetaKey.Selector].$transaction
					&& utxoOutput[EntityMetaKey.Selector].$transaction.txId != null
					&& utxoOutput[EntityMetaKey.Selector].$transaction != null && '$network' in utxoOutput[EntityMetaKey.Selector].$transaction ?
						utxoOutput[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in utxoOutput[EntityMetaKey.Selector].$transaction.$network
						&& utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
						outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
						transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
						network: String(caip2StringFromValue(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
					})
					:
							utxoOutput[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in utxoOutput[EntityMetaKey.Selector].$transaction.$network
							&& utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
							outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
							transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
							network: String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
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
				{(String((utxoOutputFields.indexInTransaction) ?? '') ? 'Output #' + String((utxoOutputFields.indexInTransaction) ?? '') : '') || 'UTXO output'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((utxoOutputFields.$address.address) ?? '')].filter(Boolean).join(' ') || 'UTXO address', String((utxoOutputFields.isSpent) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
