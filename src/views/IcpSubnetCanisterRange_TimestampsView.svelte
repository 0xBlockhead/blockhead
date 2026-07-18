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
		title = 'ICP subnet canister range observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'IcpSubnetCanisterRange_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.IcpSubnetCanisterRange_Timestamp>
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
	import IcpSubnetCanisterRange_TimestampView from '$/views/IcpSubnetCanisterRange_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpSubnetCanisterRange_Timestamp}
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
	getResourceItems={(icpSubnetCanisterRangeTimestamps) => [...new Map(icpSubnetCanisterRangeTimestamps.values.map((icpSubnetCanisterRangeTimestamp) => [icpSubnetCanisterRangeTimestamp[EntityMetaKey.SelectorKey], icpSubnetCanisterRangeTimestamp])).values()]}
	getKey={(icpSubnetCanisterRangeTimestamp) => icpSubnetCanisterRangeTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ICP subnet canister range observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: icpSubnetCanisterRangeTimestamp })}
		{@const icpSubnetCanisterRangeTimestampFields = { ...icpSubnetCanisterRangeTimestamp[EntityMetaKey.Selector], ...icpSubnetCanisterRangeTimestamp }}
		{@const selection = select(EntityType.IcpSubnetCanisterRange_Timestamp, icpSubnetCanisterRangeTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<IcpSubnetCanisterRange_TimestampView
			selection={selection}
			prefetched={icpSubnetCanisterRangeTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
