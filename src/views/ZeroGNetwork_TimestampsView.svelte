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
		title = 'Zero g network observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZeroGNetwork_Timestamp>
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
	entityType={EntityType.ZeroGNetwork_Timestamp}
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
				$network: {
					fields: {
						name: true,
						environment: true,
					},
				},
				timestampMs: true,
				storageTransactionCount: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zeroGNetworkTimestamps) => [...new Map(zeroGNetworkTimestamps.values.map((zeroGNetworkTimestamp) => [zeroGNetworkTimestamp[EntityMetaKey.SelectorKey], zeroGNetworkTimestamp])).values()]}
	getKey={(zeroGNetworkTimestamp) => zeroGNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zero g network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zeroGNetworkTimestamp })}
		{@const zeroGNetworkTimestampFields = { ...zeroGNetworkTimestamp[EntityMetaKey.Selector], ...zeroGNetworkTimestamp }}
		<EntityView
			entityType={EntityType.ZeroGNetwork_Timestamp}
			entitySelector={zeroGNetworkTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((zeroGNetworkTimestampFields.$network.name) ?? '')].filter(Boolean).join(' ') || 'zero g network'].filter(Boolean).join(' ') || 'zero g network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((zeroGNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((zeroGNetworkTimestampFields.storageTransactionCount) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
