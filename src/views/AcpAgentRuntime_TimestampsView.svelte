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
		title = 'ACP agent runtime observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AcpAgentRuntime_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AcpAgentRuntime_Timestamp>
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
	import AcpAgentRuntime_TimestampView from '$/views/AcpAgentRuntime_TimestampView.svelte'
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
					health: true,
					protocolVersion: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(acpAgentRuntimeTimestamps)}
			{@const uniqueAcpAgentRuntimeTimestamps = [...new Map(acpAgentRuntimeTimestamps.values.map((acpAgentRuntimeTimestamp) => [acpAgentRuntimeTimestamp[EntityMetaKey.SelectorKey], acpAgentRuntimeTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AcpAgentRuntime_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={acpAgentRuntimeTimestamps.totalCount}
				getKey={(acpAgentRuntimeTimestamp) => acpAgentRuntimeTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueAcpAgentRuntimeTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ACP agent runtime observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: acpAgentRuntimeTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AcpAgentRuntime_Timestamp> })}
					{@const acpAgentRuntimeTimestampFields = { ...acpAgentRuntimeTimestamp[EntityMetaKey.Selector], ...acpAgentRuntimeTimestamp }}
					<AcpAgentRuntime_TimestampView
						selection={select(EntityType.AcpAgentRuntime_Timestamp, acpAgentRuntimeTimestamp[EntityMetaKey.Selector])}
						prefetched={acpAgentRuntimeTimestampFields}
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
		entityType={EntityType.AcpAgentRuntime_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
