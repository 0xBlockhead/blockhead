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
		title = 'Blockhead payjoin sessions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadPayjoinSessions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadPayjoinSession>
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
	entityType={EntityType.BlockheadPayjoinSession}
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
				sessionId: true,
				status: true,
				role: true,
				amountSats: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadPayjoinSessions) => [...new Map(blockheadPayjoinSessions.values.map((blockheadPayjoinSession) => [blockheadPayjoinSession[EntityMetaKey.SelectorKey], blockheadPayjoinSession])).values()]}
	getKey={(blockheadPayjoinSession) => blockheadPayjoinSession[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead payjoin sessions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadPayjoinSession })}
		{@const blockheadPayjoinSessionFields = { ...blockheadPayjoinSession[EntityMetaKey.Selector], ...blockheadPayjoinSession }}
		<EntityView
			entityType={EntityType.BlockheadPayjoinSession}
			entitySelector={blockheadPayjoinSession[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadPayjoinSessionFields.sessionId) ?? '')].filter(Boolean).join(' ') || 'blockhead payjoin session'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadPayjoinSessionFields.status) ?? ''), String((blockheadPayjoinSessionFields.role) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadPayjoinSessionFields.amountSats) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
