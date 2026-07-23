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
		title = 'Filecoin pending messages',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadFilecoinPendingMessages-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadFilecoinPendingMessage>
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
	entityType={EntityType.BlockheadFilecoinPendingMessage}
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
				messageCid: true,
				observedAtMs: true,
				local: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadFilecoinPendingMessages) => [...new Map(blockheadFilecoinPendingMessages.values.map((blockheadFilecoinPendingMessage) => [blockheadFilecoinPendingMessage[EntityMetaKey.SelectorKey], blockheadFilecoinPendingMessage])).values()]}
	getKey={(blockheadFilecoinPendingMessage) => blockheadFilecoinPendingMessage[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead filecoin pending messages yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadFilecoinPendingMessage })}
		{@const blockheadFilecoinPendingMessageFields = { ...blockheadFilecoinPendingMessage[EntityMetaKey.Selector], ...blockheadFilecoinPendingMessage }}
		<EntityView
			entityType={EntityType.BlockheadFilecoinPendingMessage}
			entitySelector={blockheadFilecoinPendingMessage[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadFilecoinPendingMessageFields.messageCid) ?? '')].filter(Boolean).join(' ') || 'blockhead filecoin pending message'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadFilecoinPendingMessageFields.observedAtMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadFilecoinPendingMessageFields.local) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
