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
		title = 'Eigen layer delegation observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerDelegation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EigenLayerDelegation_Timestamp>
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
	import EigenLayerDelegation_TimestampView from '$/views/EigenLayerDelegation_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerDelegation_Timestamp}
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
				$staker: true,
				$operator: true,
				$strategy: true,
			},
		})
	}
	getResourceItems={(eigenLayerDelegationTimestamps) => [...new Map(eigenLayerDelegationTimestamps.values.map((eigenLayerDelegationTimestamp) => [eigenLayerDelegationTimestamp[EntityMetaKey.SelectorKey], eigenLayerDelegationTimestamp])).values()]}
	getKey={(eigenLayerDelegationTimestamp) => eigenLayerDelegationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eigen layer delegation observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerDelegationTimestamp })}
		{@const eigenLayerDelegationTimestampFields = { ...eigenLayerDelegationTimestamp[EntityMetaKey.Selector], ...eigenLayerDelegationTimestamp }}
		{@const selection = select(EntityType.EigenLayerDelegation_Timestamp, eigenLayerDelegationTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<EigenLayerDelegation_TimestampView
			selection={selection}
			prefetched={eigenLayerDelegationTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
