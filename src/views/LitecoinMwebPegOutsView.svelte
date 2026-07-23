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
		title = 'Litecoin MWEB peg outs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LitecoinMwebPegOuts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LitecoinMwebPegOut>
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
	entityType={EntityType.LitecoinMwebPegOut}
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
				$transaction: true,
				pegOutIndex: true,
				$transparentOutput: true,
			},
		})
	}
	{countResource}
	getResourceItems={(litecoinMwebPegOuts) => [...new Map(litecoinMwebPegOuts.values.map((litecoinMwebPegOut) => [litecoinMwebPegOut[EntityMetaKey.SelectorKey], litecoinMwebPegOut])).values()]}
	getKey={(litecoinMwebPegOut) => litecoinMwebPegOut[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Litecoin MWEB peg outs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: litecoinMwebPegOut })}
		{@const litecoinMwebPegOutFields = { ...litecoinMwebPegOut[EntityMetaKey.Selector], ...litecoinMwebPegOut }}
		<EntityView
			entityType={EntityType.LitecoinMwebPegOut}
			entitySelector={litecoinMwebPegOut[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[[(String((litecoinMwebPegOutFields.$transaction.$mwebBlock.$block.height) ?? '') ? 'Block #' + String((litecoinMwebPegOutFields.$transaction.$mwebBlock.$block.height) ?? '') : '') || [String((litecoinMwebPegOutFields.$transaction.$mwebBlock.$block.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block'].filter(Boolean).join(' ') || 'litecoin MWEB block'].filter(Boolean).join(' ') || 'litecoin MWEB transaction'].filter(Boolean).join(' ') || 'litecoin MWEB peg out'}
			{/snippet}

			{#snippet Value()}
				{[String((litecoinMwebPegOutFields.pegOutIndex) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((litecoinMwebPegOutFields.$transparentOutput.indexInTransaction) ?? '') ? 'Output #' + String((litecoinMwebPegOutFields.$transparentOutput.indexInTransaction) ?? '') : '') || 'UTXO output'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
