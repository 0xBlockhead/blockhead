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
		title = 'Blockhead transfer intents',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadTransferIntents-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadTransferIntent>
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
	entityType={EntityType.BlockheadTransferIntent}
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
				$sessionAction: true,
				amount: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadTransferIntents) => [...new Map(blockheadTransferIntents.values.map((blockheadTransferIntent) => [blockheadTransferIntent[EntityMetaKey.SelectorKey], blockheadTransferIntent])).values()]}
	getKey={(blockheadTransferIntent) => blockheadTransferIntent[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead transfer intents yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadTransferIntent })}
		{@const blockheadTransferIntentFields = { ...blockheadTransferIntent[EntityMetaKey.Selector], ...blockheadTransferIntent }}
		<EntityView
			entityType={EntityType.BlockheadTransferIntent}
			entitySelector={blockheadTransferIntent[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((blockheadTransferIntentFields.$sessionAction.actionType) ?? '')].filter(Boolean).join(' ') || 'blockhead session action'].filter(Boolean).join(' ') || 'blockhead transfer intent'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadTransferIntentFields.amount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((blockheadTransferIntentFields.$network.name) ?? '')].filter(Boolean).join(' ') || [blockheadTransferIntentFields.$network.caip2 == null ? '' : String(`${(blockheadTransferIntentFields.$network.caip2).namespace}:${(blockheadTransferIntentFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
