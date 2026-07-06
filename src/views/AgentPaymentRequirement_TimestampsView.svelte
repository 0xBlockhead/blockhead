<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Agent payment requirement observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AgentPaymentRequirement_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AgentPaymentRequirement_Timestamp>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AgentPaymentRequirement_TimestampView from '$/views/AgentPaymentRequirement_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AgentPaymentRequirement_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(agentPaymentRequirementTimestamps)}
			{@const uniqueAgentPaymentRequirementTimestamps = [...new Map(agentPaymentRequirementTimestamps.values.map((agentPaymentRequirementTimestamp) => [agentPaymentRequirementTimestamp[EntityMetaKey.SelectorKey], agentPaymentRequirementTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AgentPaymentRequirement_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={agentPaymentRequirementTimestamps.totalCount}
				getKey={(agentPaymentRequirementTimestamp) => agentPaymentRequirementTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueAgentPaymentRequirementTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Agent payment requirement observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: agentPaymentRequirementTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AgentPaymentRequirement_Timestamp> })}
					{@const agentPaymentRequirementTimestampFields = { ...agentPaymentRequirementTimestamp[EntityMetaKey.Selector], ...agentPaymentRequirementTimestamp }}
					<AgentPaymentRequirement_TimestampView
						selection={select(EntityType.AgentPaymentRequirement_Timestamp, agentPaymentRequirementTimestamp[EntityMetaKey.Selector])}
						prefetched={agentPaymentRequirementTimestampFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.AgentPaymentRequirement_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
