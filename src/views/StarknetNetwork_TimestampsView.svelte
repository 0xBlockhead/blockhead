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
		title = 'Starknet network observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'StarknetNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.StarknetNetwork_Timestamp>
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
	entityType={EntityType.StarknetNetwork_Timestamp}
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
				$network: true,
				timestampMs: true,
				latestBlockNumber: true,
			},
		})
	}
	{countResource}
	getResourceItems={(starknetNetworkTimestamps) => [...new Map(starknetNetworkTimestamps.values.map((starknetNetworkTimestamp) => [starknetNetworkTimestamp[EntityMetaKey.SelectorKey], starknetNetworkTimestamp])).values()]}
	getKey={(starknetNetworkTimestamp) => starknetNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Starknet network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: starknetNetworkTimestamp })}
		{@const starknetNetworkTimestampFields = { ...starknetNetworkTimestamp[EntityMetaKey.Selector], ...starknetNetworkTimestamp }}
		<EntityView
			entityType={EntityType.StarknetNetwork_Timestamp}
			entitySelector={starknetNetworkTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[[String((starknetNetworkTimestampFields.$network.$network.name) ?? '')].filter(Boolean).join(' ') || [starknetNetworkTimestampFields.$network.$network.caip2 == null ? '' : String(`${(starknetNetworkTimestampFields.$network.$network.caip2).namespace}:${(starknetNetworkTimestampFields.$network.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ') || 'starknet network'].filter(Boolean).join(' ') || 'starknet network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((starknetNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((starknetNetworkTimestampFields.latestBlockNumber) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
