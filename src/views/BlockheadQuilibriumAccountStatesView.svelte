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
		title = 'Blockhead Quilibrium account states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadQuilibriumAccountStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadQuilibriumAccountState>
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
	entityType={EntityType.BlockheadQuilibriumAccountState}
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
				accountAddress: true,
				$network: true,
				accountKind: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadQuilibriumAccountStates) => [...new Map(blockheadQuilibriumAccountStates.values.map((blockheadQuilibriumAccountState) => [blockheadQuilibriumAccountState[EntityMetaKey.SelectorKey], blockheadQuilibriumAccountState])).values()]}
	getKey={(blockheadQuilibriumAccountState) => blockheadQuilibriumAccountState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead quilibrium account states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadQuilibriumAccountState })}
		{@const blockheadQuilibriumAccountStateFields = { ...blockheadQuilibriumAccountState[EntityMetaKey.Selector], ...blockheadQuilibriumAccountState }}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumAccountState}
			entitySelector={blockheadQuilibriumAccountState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadQuilibriumAccountStateFields.accountAddress) ?? '')].filter(Boolean).join(' ') || 'blockhead quilibrium account state'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadQuilibriumAccountStateFields.$network.name) ?? '')].filter(Boolean).join(' ') || [blockheadQuilibriumAccountStateFields.$network.caip2 == null ? '' : String(`${(blockheadQuilibriumAccountStateFields.$network.caip2).namespace}:${(blockheadQuilibriumAccountStateFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadQuilibriumAccountStateFields.accountKind) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
