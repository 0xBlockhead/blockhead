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
		title = 'EIP-8004 agent service endpoints',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004AgentServiceEndpoints-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Eip8004AgentServiceEndpoint>
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
	import Eip8004AgentServiceEndpointView from '$/views/Eip8004AgentServiceEndpointView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip8004AgentServiceEndpoint}
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
				endpointUrl: true,
				endpointKind: true,
				protocolKind: true,
			},
		})
	}
	getResourceItems={(eip8004AgentServiceEndpoints) => [...new Map(eip8004AgentServiceEndpoints.values.map((eip8004AgentServiceEndpoint) => [eip8004AgentServiceEndpoint[EntityMetaKey.SelectorKey], eip8004AgentServiceEndpoint])).values()]}
	getKey={(eip8004AgentServiceEndpoint) => eip8004AgentServiceEndpoint[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EIP-8004 agent service endpoints yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eip8004AgentServiceEndpoint })}
		{@const eip8004AgentServiceEndpointFields = { ...eip8004AgentServiceEndpoint[EntityMetaKey.Selector], ...eip8004AgentServiceEndpoint }}
		{@const selection = select(EntityType.Eip8004AgentServiceEndpoint, eip8004AgentServiceEndpoint[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<Eip8004AgentServiceEndpointView
			selection={selection}
			prefetched={eip8004AgentServiceEndpointFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
