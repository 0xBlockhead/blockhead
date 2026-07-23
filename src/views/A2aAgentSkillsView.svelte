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
		title = 'A2A agent skills',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'A2aAgentSkills-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.A2aAgentSkill>
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
	entityType={EntityType.A2aAgentSkill}
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
				$cardSnapshot: {
					fields: {
						name: true,
						version: true,
						protocolVersion: true,
					},
				},
				skillId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(a2aAgentSkills) => [...new Map(a2aAgentSkills.values.map((a2aAgentSkill) => [a2aAgentSkill[EntityMetaKey.SelectorKey], a2aAgentSkill])).values()]}
	getKey={(a2aAgentSkill) => a2aAgentSkill[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No A2A agent skills yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: a2aAgentSkill })}
		{@const a2aAgentSkillFields = { ...a2aAgentSkill[EntityMetaKey.Selector], ...a2aAgentSkill }}
		<EntityView
			entityType={EntityType.A2aAgentSkill}
			entitySelector={a2aAgentSkill[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((a2aAgentSkillFields.name) ?? '')].filter(Boolean).join(' ') || [String((a2aAgentSkillFields.skillId) ?? '')].filter(Boolean).join(' ') || 'A2A agent skill'}
			{/snippet}

			{#snippet Value()}
				{[[String((a2aAgentSkillFields.$cardSnapshot.name) ?? '')].filter(Boolean).join(' ') || [String((a2aAgentSkillFields.$cardSnapshot.contentHash) ?? '')].filter(Boolean).join(' ') || 'A2A agent card snapshot'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
