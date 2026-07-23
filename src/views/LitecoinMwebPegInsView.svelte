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
		title = 'Litecoin MWEB peg ins',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LitecoinMwebPegIns-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LitecoinMwebPegIn>
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
	entityType={EntityType.LitecoinMwebPegIn}
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
				pegInIndex: true,
				$transparentOutput: true,
			},
		})
	}
	{countResource}
	getResourceItems={(litecoinMwebPegIns) => [...new Map(litecoinMwebPegIns.values.map((litecoinMwebPegIn) => [litecoinMwebPegIn[EntityMetaKey.SelectorKey], litecoinMwebPegIn])).values()]}
	getKey={(litecoinMwebPegIn) => litecoinMwebPegIn[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Litecoin MWEB peg ins yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: litecoinMwebPegIn })}
		{@const litecoinMwebPegInFields = { ...litecoinMwebPegIn[EntityMetaKey.Selector], ...litecoinMwebPegIn }}
		<EntityView
			entityType={EntityType.LitecoinMwebPegIn}
			entitySelector={litecoinMwebPegIn[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[[(String((litecoinMwebPegInFields.$transaction.$mwebBlock.$block.height) ?? '') ? 'Block #' + String((litecoinMwebPegInFields.$transaction.$mwebBlock.$block.height) ?? '') : '') || [String((litecoinMwebPegInFields.$transaction.$mwebBlock.$block.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block'].filter(Boolean).join(' ') || 'litecoin MWEB block'].filter(Boolean).join(' ') || 'litecoin MWEB transaction'].filter(Boolean).join(' ') || 'litecoin MWEB peg in'}
			{/snippet}

			{#snippet Value()}
				{[String((litecoinMwebPegInFields.pegInIndex) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((litecoinMwebPegInFields.$transparentOutput.indexInTransaction) ?? '') ? 'Output #' + String((litecoinMwebPegInFields.$transparentOutput.indexInTransaction) ?? '') : '') || 'UTXO output'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
