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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AvalancheSubnet_Timestamp>
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
	import AvalancheSubnet_TimestampView from '$/views/AvalancheSubnet_TimestampView.svelte'
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
		{@const selection = select(EntityType.AvalancheSubnet_Timestamp, avalancheSubnetTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AvalancheSubnet_TimestampView
			selection={selection}
			prefetched={avalancheSubnetTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
