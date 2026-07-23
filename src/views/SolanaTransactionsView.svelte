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
		title = 'Transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SolanaTransaction>
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
	entityType={EntityType.SolanaTransaction}
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
				signature: true,
				status: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(solanaTransactions) => [...new Map(solanaTransactions.values.map((solanaTransaction) => [solanaTransaction[EntityMetaKey.SelectorKey], solanaTransaction])).values()]}
	getKey={(solanaTransaction) => solanaTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Solana transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: solanaTransaction })}
		{@const solanaTransactionFields = { ...solanaTransaction[EntityMetaKey.Selector], ...solanaTransaction }}
		<EntityView
			entityType={EntityType.SolanaTransaction}
			entitySelector={solanaTransaction[EntityMetaKey.Selector]}
			href={
				(
					solanaTransaction[EntityMetaKey.Selector] != null && 'signature' in solanaTransaction[EntityMetaKey.Selector]
					&& solanaTransaction[EntityMetaKey.Selector].signature != null
					&& solanaTransaction[EntityMetaKey.Selector] != null && '$network' in solanaTransaction[EntityMetaKey.Selector] ?
						solanaTransaction[EntityMetaKey.Selector].$network != null && 'caip2' in solanaTransaction[EntityMetaKey.Selector].$network
						&& solanaTransaction[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
						transactionId: String(solanaTransaction[EntityMetaKey.Selector].signature ?? ''),
						network: String(caip2StringFromValue(solanaTransaction[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							solanaTransaction[EntityMetaKey.Selector].$network != null && 'slug' in solanaTransaction[EntityMetaKey.Selector].$network
							&& solanaTransaction[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(solanaTransaction[EntityMetaKey.Selector].signature ?? ''),
							network: String(solanaTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((solanaTransactionFields.signature) ?? '')].filter(Boolean).join(' ') || 'solana transaction'}
			{/snippet}

			{#snippet Value()}
				{[String((solanaTransactionFields.signature) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((solanaTransactionFields.status) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
