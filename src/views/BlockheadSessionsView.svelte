<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import BlockheadSessionCreateControl from '$/components/BlockheadSessionCreateControl.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Sessions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadSessions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadSession>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSession}
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
				name: true,
				status: true,
				id: true,
				updatedAt: true,
			},
		})
	}
	getResourceItems={(blockheadSessions) => [...new Map(blockheadSessions.values.map((blockheadSession) => [blockheadSession[EntityMetaKey.SelectorKey], blockheadSession])).values()]}
	getKey={(blockheadSession) => blockheadSession[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Sessions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadSession })}
		{@const blockheadSessionFields = { ...blockheadSession[EntityMetaKey.Selector], ...blockheadSession }}
		{@const selection = select(EntityType.BlockheadSession, blockheadSession[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const blockheadSessionHrefFields = { ...blockheadSession, ...blockheadSession[EntityMetaKey.Selector] }}
		<BlockheadSessionView
			selection={selection}
			prefetched={blockheadSessionFields}
			href={
				(blockheadSessionHrefFields.id !== undefined ? resolve('/~/session/[sessionId=stringSegment]', {
					sessionId: String(blockheadSessionHrefFields.id ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
