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
		title = 'Cardano transaction outputs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoTxOutputs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoTxOutput>
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
	entityType={EntityType.CardanoTxOutput}
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
				outputIndex: true,
				lovelace: true,
				address: true,
				$transaction: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoTxOutputs) => [...new Map(cardanoTxOutputs.values.map((cardanoTxOutput) => [cardanoTxOutput[EntityMetaKey.SelectorKey], cardanoTxOutput])).values()]}
	getKey={(cardanoTxOutput) => cardanoTxOutput[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano transaction outputs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoTxOutput })}
		{@const cardanoTxOutputFields = { ...cardanoTxOutput[EntityMetaKey.Selector], ...cardanoTxOutput }}
		<EntityView
			entityType={EntityType.CardanoTxOutput}
			entitySelector={cardanoTxOutput[EntityMetaKey.Selector]}
			href={
				(
					cardanoTxOutput[EntityMetaKey.Selector] != null && 'outputIndex' in cardanoTxOutput[EntityMetaKey.Selector]
					&& cardanoTxOutput[EntityMetaKey.Selector].outputIndex != null
					&& cardanoTxOutput[EntityMetaKey.Selector] != null && '$transaction' in cardanoTxOutput[EntityMetaKey.Selector]
					&& cardanoTxOutput[EntityMetaKey.Selector].$transaction != null && 'hash' in cardanoTxOutput[EntityMetaKey.Selector].$transaction
					&& cardanoTxOutput[EntityMetaKey.Selector].$transaction.hash != null
					&& cardanoTxOutput[EntityMetaKey.Selector].$transaction != null && '$network' in cardanoTxOutput[EntityMetaKey.Selector].$transaction ?
						cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network
						&& cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
						outputIndex: String(cardanoTxOutput[EntityMetaKey.Selector].outputIndex ?? ''),
						transactionId: String(cardanoTxOutput[EntityMetaKey.Selector].$transaction.hash ?? ''),
						network: String(caip2StringFromValue(cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
					})
					:
							cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network
							&& cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
							outputIndex: String(cardanoTxOutput[EntityMetaKey.Selector].outputIndex ?? ''),
							transactionId: String(cardanoTxOutput[EntityMetaKey.Selector].$transaction.hash ?? ''),
							network: String(cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
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
				{[String((cardanoTxOutputFields.outputIndex) ?? '')].filter(Boolean).join(' ') || 'Cardano transaction output'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoTxOutputFields.lovelace) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((cardanoTxOutputFields.address) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
