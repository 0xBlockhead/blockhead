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
		title = 'Cardano transaction inputs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoTxInputs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoTxInput>
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
	entityType={EntityType.CardanoTxInput}
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
				inputIndex: true,
				inputKind: true,
				spentTxHash: true,
				$transaction: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoTxInputs) => [...new Map(cardanoTxInputs.values.map((cardanoTxInput) => [cardanoTxInput[EntityMetaKey.SelectorKey], cardanoTxInput])).values()]}
	getKey={(cardanoTxInput) => cardanoTxInput[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano transaction inputs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoTxInput })}
		{@const cardanoTxInputFields = { ...cardanoTxInput[EntityMetaKey.Selector], ...cardanoTxInput }}
		<EntityView
			entityType={EntityType.CardanoTxInput}
			entitySelector={cardanoTxInput[EntityMetaKey.Selector]}
			href={
				(
					cardanoTxInput[EntityMetaKey.Selector] != null && 'inputIndex' in cardanoTxInput[EntityMetaKey.Selector]
					&& cardanoTxInput[EntityMetaKey.Selector].inputIndex != null
					&& cardanoTxInput[EntityMetaKey.Selector] != null && '$transaction' in cardanoTxInput[EntityMetaKey.Selector]
					&& cardanoTxInput[EntityMetaKey.Selector].$transaction != null && 'hash' in cardanoTxInput[EntityMetaKey.Selector].$transaction
					&& cardanoTxInput[EntityMetaKey.Selector].$transaction.hash != null
					&& cardanoTxInput[EntityMetaKey.Selector].$transaction != null && '$network' in cardanoTxInput[EntityMetaKey.Selector].$transaction ?
						cardanoTxInput[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in cardanoTxInput[EntityMetaKey.Selector].$transaction.$network
						&& cardanoTxInput[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/input/[inputIndex=nonNegativeInteger]', {
						inputIndex: String(cardanoTxInput[EntityMetaKey.Selector].inputIndex ?? ''),
						transactionId: String(cardanoTxInput[EntityMetaKey.Selector].$transaction.hash ?? ''),
						network: String(caip2StringFromValue(cardanoTxInput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
					})
					:
							cardanoTxInput[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in cardanoTxInput[EntityMetaKey.Selector].$transaction.$network
							&& cardanoTxInput[EntityMetaKey.Selector].$transaction.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/input/[inputIndex=nonNegativeInteger]', {
							inputIndex: String(cardanoTxInput[EntityMetaKey.Selector].inputIndex ?? ''),
							transactionId: String(cardanoTxInput[EntityMetaKey.Selector].$transaction.hash ?? ''),
							network: String(cardanoTxInput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
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
				{[(String((cardanoTxInputFields.inputIndex) ?? '') ? 'Input ' + String((cardanoTxInputFields.inputIndex) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano transaction input'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoTxInputFields.inputKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((cardanoTxInputFields.spentTxHash) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
