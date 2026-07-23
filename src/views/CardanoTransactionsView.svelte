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
		title = 'Cardano transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoTransaction>
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
	entityType={EntityType.CardanoTransaction}
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
				hash: true,
				blockSlot: true,
				fee: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoTransactions) => [...new Map(cardanoTransactions.values.map((cardanoTransaction) => [cardanoTransaction[EntityMetaKey.SelectorKey], cardanoTransaction])).values()]}
	getKey={(cardanoTransaction) => cardanoTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoTransaction })}
		{@const cardanoTransactionFields = { ...cardanoTransaction[EntityMetaKey.Selector], ...cardanoTransaction }}
		<EntityView
			entityType={EntityType.CardanoTransaction}
			entitySelector={cardanoTransaction[EntityMetaKey.Selector]}
			href={
				(
					cardanoTransaction[EntityMetaKey.Selector] != null && 'hash' in cardanoTransaction[EntityMetaKey.Selector]
					&& cardanoTransaction[EntityMetaKey.Selector].hash != null
					&& cardanoTransaction[EntityMetaKey.Selector] != null && '$network' in cardanoTransaction[EntityMetaKey.Selector] ?
						cardanoTransaction[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoTransaction[EntityMetaKey.Selector].$network
						&& cardanoTransaction[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
						transactionId: String(cardanoTransaction[EntityMetaKey.Selector].hash ?? ''),
						network: String(caip2StringFromValue(cardanoTransaction[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							cardanoTransaction[EntityMetaKey.Selector].$network != null && 'slug' in cardanoTransaction[EntityMetaKey.Selector].$network
							&& cardanoTransaction[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(cardanoTransaction[EntityMetaKey.Selector].hash ?? ''),
							network: String(cardanoTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((cardanoTransactionFields.hash) ?? '')].filter(Boolean).join(' ') || 'Cardano transaction'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoTransactionFields.blockSlot) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((cardanoTransactionFields.fee) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
