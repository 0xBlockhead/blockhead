<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Litecoin MWEB transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LitecoinMwebTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LitecoinMwebTransaction>
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
	entityType={EntityType.LitecoinMwebTransaction}
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
				$mwebBlock: {
					fields: {
						$block: {
							fields: {
								hash: true,
								transactionCount: true,
							},
						},
						hogExTransactionId: true,
						kernelRoot: true,
					},
				},
				transactionIndex: true,
				kernelOffset: true,
			},
		})
	}
	{countResource}
	getResourceItems={(litecoinMwebTransactions) => [...new Map(litecoinMwebTransactions.values.map((litecoinMwebTransaction) => [litecoinMwebTransaction[EntityMetaKey.SelectorKey], litecoinMwebTransaction])).values()]}
	getKey={(litecoinMwebTransaction) => litecoinMwebTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Litecoin MWEB transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: litecoinMwebTransaction })}
		{@const litecoinMwebTransactionFields = { ...litecoinMwebTransaction[EntityMetaKey.Selector], ...litecoinMwebTransaction }}
		<EntityView
			entityType={EntityType.LitecoinMwebTransaction}
			entitySelector={litecoinMwebTransaction[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[(String((litecoinMwebTransactionFields.$mwebBlock.$block.height) ?? '') ? 'Block #' + String((litecoinMwebTransactionFields.$mwebBlock.$block.height) ?? '') : '') || [String((litecoinMwebTransactionFields.$mwebBlock.$block.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block'].filter(Boolean).join(' ') || 'litecoin MWEB block'].filter(Boolean).join(' ') || 'litecoin MWEB transaction'}
			{/snippet}

			{#snippet Value()}
				{[String((litecoinMwebTransactionFields.transactionIndex) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((litecoinMwebTransactionFields.kernelOffset) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
