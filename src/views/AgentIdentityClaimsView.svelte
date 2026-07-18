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
		title = 'agent identity claims',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AgentIdentityClaims-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AgentIdentityClaim>
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
	import AgentIdentityClaimView from '$/views/AgentIdentityClaimView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AgentIdentityClaim}
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
				identityKind: true,
				subjectKind: true,
				objectKind: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(agentIdentityClaims) => [...new Map(agentIdentityClaims.values.map((agentIdentityClaim) => [agentIdentityClaim[EntityMetaKey.SelectorKey], agentIdentityClaim])).values()]}
	getKey={(agentIdentityClaim) => agentIdentityClaim[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Agent identity claims yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: agentIdentityClaim })}
		{@const agentIdentityClaimFields = { ...agentIdentityClaim[EntityMetaKey.Selector], ...agentIdentityClaim }}
		{@const selection = select(EntityType.AgentIdentityClaim, agentIdentityClaim[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AgentIdentityClaimView
			selection={selection}
			prefetched={agentIdentityClaimFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
