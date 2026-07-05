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
		title = 'EIP-8004 agent registration observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004AgentRegistration_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Eip8004AgentRegistration_Timestamp>
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
	import Eip8004AgentRegistration_TimestampView from '$/views/Eip8004AgentRegistration_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					timestampMs: true,
					active: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(eip8004AgentRegistrationTimestamps)}
			{@const uniqueEip8004AgentRegistrationTimestamps = [...new Map(eip8004AgentRegistrationTimestamps.values.map((eip8004AgentRegistrationTimestamp) => [eip8004AgentRegistrationTimestamp[EntityMetaKey.SelectorKey], eip8004AgentRegistrationTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Eip8004AgentRegistration_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={eip8004AgentRegistrationTimestamps.totalCount}
				getKey={(eip8004AgentRegistrationTimestamp) => eip8004AgentRegistrationTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEip8004AgentRegistrationTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EIP-8004 agent registration observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: eip8004AgentRegistrationTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Eip8004AgentRegistration_Timestamp> })}
					{@const eip8004AgentRegistrationTimestampFields = { ...eip8004AgentRegistrationTimestamp[EntityMetaKey.Selector], ...eip8004AgentRegistrationTimestamp }}
					<Eip8004AgentRegistration_TimestampView
						selection={select(EntityType.Eip8004AgentRegistration_Timestamp, eip8004AgentRegistrationTimestamp[EntityMetaKey.Selector])}
						prefetched={eip8004AgentRegistrationTimestampFields}
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
		entityType={EntityType.Eip8004AgentRegistration_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
