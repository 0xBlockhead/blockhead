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
		title = 'Blockhead Litecoin MWEB output states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLitecoinMwebOutputStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLitecoinMwebOutputState>
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
	entityType={EntityType.BlockheadLitecoinMwebOutputState}
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
				commitment: true,
				walletId: true,
				amountLitoshis: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLitecoinMwebOutputStates) => [...new Map(blockheadLitecoinMwebOutputStates.values.map((blockheadLitecoinMwebOutputState) => [blockheadLitecoinMwebOutputState[EntityMetaKey.SelectorKey], blockheadLitecoinMwebOutputState])).values()]}
	getKey={(blockheadLitecoinMwebOutputState) => blockheadLitecoinMwebOutputState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead litecoin mweb output states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLitecoinMwebOutputState })}
		{@const blockheadLitecoinMwebOutputStateFields = { ...blockheadLitecoinMwebOutputState[EntityMetaKey.Selector], ...blockheadLitecoinMwebOutputState }}
		<EntityView
			entityType={EntityType.BlockheadLitecoinMwebOutputState}
			entitySelector={blockheadLitecoinMwebOutputState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLitecoinMwebOutputStateFields.commitment) ?? '')].filter(Boolean).join(' ') || 'blockhead litecoin mweb output state'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLitecoinMwebOutputStateFields.walletId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadLitecoinMwebOutputStateFields.amountLitoshis) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
