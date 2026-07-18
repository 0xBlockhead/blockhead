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
		title = 'Agent payment requirement observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AgentPaymentRequirement_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AgentPaymentRequirement_Timestamp>
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
	import AgentPaymentRequirement_TimestampView from '$/views/AgentPaymentRequirement_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AgentPaymentRequirement_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	getResourceItems={(agentPaymentRequirementTimestamps) => [...new Map(agentPaymentRequirementTimestamps.values.map((agentPaymentRequirementTimestamp) => [agentPaymentRequirementTimestamp[EntityMetaKey.SelectorKey], agentPaymentRequirementTimestamp])).values()]}
	getKey={(agentPaymentRequirementTimestamp) => agentPaymentRequirementTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Agent payment requirement observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: agentPaymentRequirementTimestamp })}
		{@const agentPaymentRequirementTimestampFields = { ...agentPaymentRequirementTimestamp[EntityMetaKey.Selector], ...agentPaymentRequirementTimestamp }}
		{@const selection = select(EntityType.AgentPaymentRequirement_Timestamp, agentPaymentRequirementTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AgentPaymentRequirement_TimestampView
			selection={selection}
			prefetched={agentPaymentRequirementTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
