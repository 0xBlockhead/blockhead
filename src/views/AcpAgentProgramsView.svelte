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
		title = 'ACP agent programs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AcpAgentPrograms-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AcpAgentProgram>
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
	entityType={EntityType.AcpAgentProgram}
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
				packageName: true,
				registryAgentId: true,
				repositoryUrl: true,
			},
		})
	}
	{countResource}
	getResourceItems={(acpAgentPrograms) => [...new Map(acpAgentPrograms.values.map((acpAgentProgram) => [acpAgentProgram[EntityMetaKey.SelectorKey], acpAgentProgram])).values()]}
	getKey={(acpAgentProgram) => acpAgentProgram[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ACP agent programs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: acpAgentProgram })}
		{@const acpAgentProgramFields = { ...acpAgentProgram[EntityMetaKey.Selector], ...acpAgentProgram }}
		<EntityView
			entityType={EntityType.AcpAgentProgram}
			entitySelector={acpAgentProgram[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((acpAgentProgramFields.label) ?? '')].filter(Boolean).join(' ') || [String((acpAgentProgramFields.registryAgentId) ?? ''), String((acpAgentProgramFields.packageName) ?? ''), String((acpAgentProgramFields.repositoryUrl) ?? '')].filter(Boolean).join(' ') || 'ACP agent program'}
			{/snippet}

			{#snippet Value()}
				{[String((acpAgentProgramFields.packageName) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
