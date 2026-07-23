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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.IcpSubnetCanisterRange_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.IcpSubnetCanisterRange_Timestamp}
			entitySelector={icpSubnetCanisterRangeTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'ICP subnet canister range timestamp'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
