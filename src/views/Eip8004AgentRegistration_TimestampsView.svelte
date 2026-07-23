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
		title = 'EIP-8004 agent registration observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004AgentRegistration_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Eip8004AgentRegistration_Timestamp>
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
	entityType={EntityType.Eip8004AgentRegistration_Timestamp}
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
				timestampMs: true,
				active: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eip8004AgentRegistrationTimestamps) => [...new Map(eip8004AgentRegistrationTimestamps.values.map((eip8004AgentRegistrationTimestamp) => [eip8004AgentRegistrationTimestamp[EntityMetaKey.SelectorKey], eip8004AgentRegistrationTimestamp])).values()]}
	getKey={(eip8004AgentRegistrationTimestamp) => eip8004AgentRegistrationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EIP-8004 agent registration observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eip8004AgentRegistrationTimestamp })}
		{@const eip8004AgentRegistrationTimestampFields = { ...eip8004AgentRegistrationTimestamp[EntityMetaKey.Selector], ...eip8004AgentRegistrationTimestamp }}
		<EntityView
			entityType={EntityType.Eip8004AgentRegistration_Timestamp}
			entitySelector={eip8004AgentRegistrationTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((eip8004AgentRegistrationTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 agent registration timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((eip8004AgentRegistrationTimestampFields.active) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((eip8004AgentRegistrationTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
