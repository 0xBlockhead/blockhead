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
		title = 'Litecoin MWEB blocks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LitecoinMwebBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LitecoinMwebBlock>
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
	entityType={EntityType.LitecoinMwebBlock}
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
				$block: {
					fields: {
						hash: true,
						transactionCount: true,
					},
				},
				hogExTransactionId: true,
				kernelRoot: true,
			},
		})
	}
	{countResource}
	getResourceItems={(litecoinMwebBlocks) => [...new Map(litecoinMwebBlocks.values.map((litecoinMwebBlock) => [litecoinMwebBlock[EntityMetaKey.SelectorKey], litecoinMwebBlock])).values()]}
	getKey={(litecoinMwebBlock) => litecoinMwebBlock[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Litecoin MWEB blocks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: litecoinMwebBlock })}
		{@const litecoinMwebBlockFields = { ...litecoinMwebBlock[EntityMetaKey.Selector], ...litecoinMwebBlock }}
		<EntityView
			entityType={EntityType.LitecoinMwebBlock}
			entitySelector={litecoinMwebBlock[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[(String((litecoinMwebBlockFields.$block.height) ?? '') ? 'Block #' + String((litecoinMwebBlockFields.$block.height) ?? '') : '') || [String((litecoinMwebBlockFields.$block.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block'].filter(Boolean).join(' ') || 'litecoin MWEB block'}
			{/snippet}

			{#snippet Value()}
				{[String((litecoinMwebBlockFields.hogExTransactionId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((litecoinMwebBlockFields.kernelRoot) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
