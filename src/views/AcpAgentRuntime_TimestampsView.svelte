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
		title = 'ACP agent runtime observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AcpAgentRuntime_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AcpAgentRuntime_Timestamp>
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
	entityType={EntityType.AcpAgentRuntime_Timestamp}
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
				health: true,
				protocolVersion: true,
			},
		})
	}
	{countResource}
	getResourceItems={(acpAgentRuntimeTimestamps) => [...new Map(acpAgentRuntimeTimestamps.values.map((acpAgentRuntimeTimestamp) => [acpAgentRuntimeTimestamp[EntityMetaKey.SelectorKey], acpAgentRuntimeTimestamp])).values()]}
	getKey={(acpAgentRuntimeTimestamp) => acpAgentRuntimeTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ACP agent runtime observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: acpAgentRuntimeTimestamp })}
		{@const acpAgentRuntimeTimestampFields = { ...acpAgentRuntimeTimestamp[EntityMetaKey.Selector], ...acpAgentRuntimeTimestamp }}
		<EntityView
			entityType={EntityType.AcpAgentRuntime_Timestamp}
			entitySelector={acpAgentRuntimeTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((acpAgentRuntimeTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ACP agent runtime timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((acpAgentRuntimeTimestampFields.health) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((acpAgentRuntimeTimestampFields.protocolVersion) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
