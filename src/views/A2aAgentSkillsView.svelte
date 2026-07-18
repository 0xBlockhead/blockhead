<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.A2aAgentSkill>
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
	import A2aAgentSkillView from '$/views/A2aAgentSkillView.svelte'
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
				$cardSnapshot: true,
				skillId: true,
			},
		})
	}
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
		{@const selection = select(EntityType.A2aAgentSkill, a2aAgentSkill[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<A2aAgentSkillView
			selection={selection}
			prefetched={a2aAgentSkillFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
