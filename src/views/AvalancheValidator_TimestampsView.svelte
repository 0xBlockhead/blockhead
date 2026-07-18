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
		title = 'Avalanche validator observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AvalancheValidator_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AvalancheValidator_Timestamp>
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
	import AvalancheValidator_TimestampView from '$/views/AvalancheValidator_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalancheValidator_Timestamp}
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
				connected: true,
				uptimePercent: true,
				source: true,
			},
		})
	}
	getResourceItems={(avalancheValidatorTimestamps) => [...new Map(avalancheValidatorTimestamps.values.map((avalancheValidatorTimestamp) => [avalancheValidatorTimestamp[EntityMetaKey.SelectorKey], avalancheValidatorTimestamp])).values()]}
	getKey={(avalancheValidatorTimestamp) => avalancheValidatorTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Avalanche validator observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: avalancheValidatorTimestamp })}
		{@const avalancheValidatorTimestampFields = { ...avalancheValidatorTimestamp[EntityMetaKey.Selector], ...avalancheValidatorTimestamp }}
		{@const selection = select(EntityType.AvalancheValidator_Timestamp, avalancheValidatorTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AvalancheValidator_TimestampView
			selection={selection}
			prefetched={avalancheValidatorTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
