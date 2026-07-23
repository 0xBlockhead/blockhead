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
		title = 'Avalanche subnet observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AvalancheSubnet_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AvalancheSubnet_Timestamp>
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
	entityType={EntityType.AvalancheSubnet_Timestamp}
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
				validatorCount: true,
				delegatorCount: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(avalancheSubnetTimestamps) => [...new Map(avalancheSubnetTimestamps.values.map((avalancheSubnetTimestamp) => [avalancheSubnetTimestamp[EntityMetaKey.SelectorKey], avalancheSubnetTimestamp])).values()]}
	getKey={(avalancheSubnetTimestamp) => avalancheSubnetTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Avalanche subnet observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: avalancheSubnetTimestamp })}
		{@const avalancheSubnetTimestampFields = { ...avalancheSubnetTimestamp[EntityMetaKey.Selector], ...avalancheSubnetTimestamp }}
		<EntityView
			entityType={EntityType.AvalancheSubnet_Timestamp}
			entitySelector={avalancheSubnetTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((avalancheSubnetTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'avalanche subnet timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((avalancheSubnetTimestampFields.validatorCount) ?? ''), String((avalancheSubnetTimestampFields.delegatorCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((avalancheSubnetTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
