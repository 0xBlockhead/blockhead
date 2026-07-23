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
		title = 'EIP-8004 agent registrations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004AgentRegistrations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Eip8004AgentRegistration>
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
	entityType={EntityType.Eip8004AgentRegistration}
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
				agentId: true,
				namespace: true,
				chainId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eip8004AgentRegistrations) => [...new Map(eip8004AgentRegistrations.values.map((eip8004AgentRegistration) => [eip8004AgentRegistration[EntityMetaKey.SelectorKey], eip8004AgentRegistration])).values()]}
	getKey={(eip8004AgentRegistration) => eip8004AgentRegistration[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EIP-8004 agent registrations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eip8004AgentRegistration })}
		{@const eip8004AgentRegistrationFields = { ...eip8004AgentRegistration[EntityMetaKey.Selector], ...eip8004AgentRegistration }}
		<EntityView
			entityType={EntityType.Eip8004AgentRegistration}
			entitySelector={eip8004AgentRegistration[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((eip8004AgentRegistrationFields.agentId) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 agent registration'}
			{/snippet}

			{#snippet Value()}
				{[String((eip8004AgentRegistrationFields.namespace) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((eip8004AgentRegistrationFields.chainId) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
