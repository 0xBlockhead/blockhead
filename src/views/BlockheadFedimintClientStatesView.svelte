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
		title = 'Blockhead Fedimint client states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadFedimintClientStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadFedimintClientState>
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
	entityType={EntityType.BlockheadFedimintClientState}
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
				clientName: true,
				federationId: true,
				clientId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadFedimintClientStates) => [...new Map(blockheadFedimintClientStates.values.map((blockheadFedimintClientState) => [blockheadFedimintClientState[EntityMetaKey.SelectorKey], blockheadFedimintClientState])).values()]}
	getKey={(blockheadFedimintClientState) => blockheadFedimintClientState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Fedimint client states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadFedimintClientState })}
		{@const blockheadFedimintClientStateFields = { ...blockheadFedimintClientState[EntityMetaKey.Selector], ...blockheadFedimintClientState }}
		<EntityView
			entityType={EntityType.BlockheadFedimintClientState}
			entitySelector={blockheadFedimintClientState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadFedimintClientStateFields.clientName) ?? '')].filter(Boolean).join(' ') || [String((blockheadFedimintClientStateFields.clientId) ?? '')].filter(Boolean).join(' ') || 'blockhead Fedimint client state'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadFedimintClientStateFields.federationId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
