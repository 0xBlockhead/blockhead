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
		title = 'EIP-8004 agent registration files',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004AgentRegistrationFiles-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Eip8004AgentRegistrationFile>
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
	entityType={EntityType.Eip8004AgentRegistrationFile}
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
				fileUrl: true,
				$registration: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eip8004AgentRegistrationFiles) => [...new Map(eip8004AgentRegistrationFiles.values.map((eip8004AgentRegistrationFile) => [eip8004AgentRegistrationFile[EntityMetaKey.SelectorKey], eip8004AgentRegistrationFile])).values()]}
	getKey={(eip8004AgentRegistrationFile) => eip8004AgentRegistrationFile[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EIP-8004 agent registration files yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eip8004AgentRegistrationFile })}
		{@const eip8004AgentRegistrationFileFields = { ...eip8004AgentRegistrationFile[EntityMetaKey.Selector], ...eip8004AgentRegistrationFile }}
		<EntityView
			entityType={EntityType.Eip8004AgentRegistrationFile}
			entitySelector={eip8004AgentRegistrationFile[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((eip8004AgentRegistrationFileFields.fileUrl) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 agent registration file'}
			{/snippet}

			{#snippet Value()}
				{[[String((eip8004AgentRegistrationFileFields.$registration.agentId) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 agent registration'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
