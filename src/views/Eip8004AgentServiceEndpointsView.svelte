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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Eip8004AgentServiceEndpoint>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.Eip8004AgentServiceEndpoint}
			entitySelector={eip8004AgentServiceEndpoint[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((eip8004AgentServiceEndpointFields.endpointUrl) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 agent service endpoint'}
			{/snippet}

			{#snippet Value()}
				{[String((eip8004AgentServiceEndpointFields.endpointKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((eip8004AgentServiceEndpointFields.protocolKind) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
