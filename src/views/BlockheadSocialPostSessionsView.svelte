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
		title = 'Social post sessions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadSocialPostSessions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadSocialPostSession>
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
	entityType={EntityType.BlockheadSocialPostSession}
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
				protocol: true,
				id: true,
				updatedAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadSocialPostSessions) => [...new Map(blockheadSocialPostSessions.values.map((blockheadSocialPostSession) => [blockheadSocialPostSession[EntityMetaKey.SelectorKey], blockheadSocialPostSession])).values()]}
	getKey={(blockheadSocialPostSession) => blockheadSocialPostSession[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead social post sessions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadSocialPostSession })}
		{@const blockheadSocialPostSessionFields = { ...blockheadSocialPostSession[EntityMetaKey.Selector], ...blockheadSocialPostSession }}
		<EntityView
			entityType={EntityType.BlockheadSocialPostSession}
			entitySelector={blockheadSocialPostSession[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadSocialPostSessionFields.name) ?? '')].filter(Boolean).join(' ') || [String((blockheadSocialPostSessionFields.id) ?? '')].filter(Boolean).join(' ') || 'blockhead social post session'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadSocialPostSessionFields.status) ?? ''), String((blockheadSocialPostSessionFields.protocol) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadSocialPostSessionFields.updatedAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
