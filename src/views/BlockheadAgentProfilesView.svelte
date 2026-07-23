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
		title = 'Blockhead agent profiles',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentProfiles-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAgentProfile>
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
	entityType={EntityType.BlockheadAgentProfile}
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
				label: true,
				$model: true,
				profileId: true,
				updatedAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadAgentProfiles) => [...new Map(blockheadAgentProfiles.values.map((blockheadAgentProfile) => [blockheadAgentProfile[EntityMetaKey.SelectorKey], blockheadAgentProfile])).values()]}
	getKey={(blockheadAgentProfile) => blockheadAgentProfile[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead agent profiles yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAgentProfile })}
		{@const blockheadAgentProfileFields = { ...blockheadAgentProfile[EntityMetaKey.Selector], ...blockheadAgentProfile }}
		<EntityView
			entityType={EntityType.BlockheadAgentProfile}
			entitySelector={blockheadAgentProfile[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadAgentProfileFields.label) ?? '')].filter(Boolean).join(' ') || [String((blockheadAgentProfileFields.profileId) ?? '')].filter(Boolean).join(' ') || 'blockhead agent profile'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadAgentProfileFields.$model.label) ?? '')].filter(Boolean).join(' ') || [String((blockheadAgentProfileFields.$model.providerModelId) ?? '')].filter(Boolean).join(' ') || 'AI model'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadAgentProfileFields.updatedAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
