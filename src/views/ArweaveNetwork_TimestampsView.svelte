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
		title = 'Arweave network observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ArweaveNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ArweaveNetwork_Timestamp>
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
	entityType={EntityType.ArweaveNetwork_Timestamp}
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
				latestHeight: true,
				source: true,
				reachable: true,
			},
		})
	}
	{countResource}
	getResourceItems={(arweaveNetworkTimestamps) => [...new Map(arweaveNetworkTimestamps.values.map((arweaveNetworkTimestamp) => [arweaveNetworkTimestamp[EntityMetaKey.SelectorKey], arweaveNetworkTimestamp])).values()]}
	getKey={(arweaveNetworkTimestamp) => arweaveNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Arweave network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: arweaveNetworkTimestamp })}
		{@const arweaveNetworkTimestampFields = { ...arweaveNetworkTimestamp[EntityMetaKey.Selector], ...arweaveNetworkTimestamp }}
		<EntityView
			entityType={EntityType.ArweaveNetwork_Timestamp}
			entitySelector={arweaveNetworkTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((arweaveNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'arweave network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((arweaveNetworkTimestampFields.latestHeight) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((arweaveNetworkTimestampFields.source) ?? ''), String((arweaveNetworkTimestampFields.reachable) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
