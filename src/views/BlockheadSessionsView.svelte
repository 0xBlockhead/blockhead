<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadSession>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BlockheadSession}
			entitySelector={blockheadSession[EntityMetaKey.Selector]}
			href={
				(
					blockheadSession[EntityMetaKey.Selector] != null && 'id' in blockheadSession[EntityMetaKey.Selector]
					&& blockheadSession[EntityMetaKey.Selector].id != null ?
						resolve('/~/session/[sessionId=stringSegment]', {
					sessionId: String(blockheadSession[EntityMetaKey.Selector].id ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadSessionFields.name) ?? '')].filter(Boolean).join(' ') || [String((blockheadSessionFields.id) ?? '')].filter(Boolean).join(' ') || 'session'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadSessionFields.status) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadSessionFields.updatedAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
