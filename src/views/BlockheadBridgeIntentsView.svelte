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
		title = 'Blockhead bridge intents',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadBridgeIntents-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadBridgeIntent>
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
	entityType={EntityType.BlockheadBridgeIntent}
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
				$fromNetwork: true,
				$toNetwork: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadBridgeIntents) => [...new Map(blockheadBridgeIntents.values.map((blockheadBridgeIntent) => [blockheadBridgeIntent[EntityMetaKey.SelectorKey], blockheadBridgeIntent])).values()]}
	getKey={(blockheadBridgeIntent) => blockheadBridgeIntent[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead bridge intents yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadBridgeIntent })}
		{@const blockheadBridgeIntentFields = { ...blockheadBridgeIntent[EntityMetaKey.Selector], ...blockheadBridgeIntent }}
		<EntityView
			entityType={EntityType.BlockheadBridgeIntent}
			entitySelector={blockheadBridgeIntent[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((blockheadBridgeIntentFields.$sessionAction.actionType) ?? '')].filter(Boolean).join(' ') || 'blockhead session action'].filter(Boolean).join(' ') || 'blockhead bridge intent'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadBridgeIntentFields.amount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((blockheadBridgeIntentFields.$fromNetwork.name) ?? '')].filter(Boolean).join(' ') || [blockheadBridgeIntentFields.$fromNetwork.caip2 == null ? '' : String(`${(blockheadBridgeIntentFields.$fromNetwork.caip2).namespace}:${(blockheadBridgeIntentFields.$fromNetwork.caip2).reference}`)].filter(Boolean).join(' ') || 'Network', [String((blockheadBridgeIntentFields.$toNetwork.name) ?? '')].filter(Boolean).join(' ') || [blockheadBridgeIntentFields.$toNetwork.caip2 == null ? '' : String(`${(blockheadBridgeIntentFields.$toNetwork.caip2).namespace}:${(blockheadBridgeIntentFields.$toNetwork.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
