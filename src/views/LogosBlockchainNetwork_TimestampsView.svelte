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
		title = 'Logos blockchain network observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LogosBlockchainNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LogosBlockchainNetwork_Timestamp>
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
	entityType={EntityType.LogosBlockchainNetwork_Timestamp}
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
				height: true,
				mode: true,
			},
		})
	}
	{countResource}
	getResourceItems={(logosBlockchainNetworkTimestamps) => [...new Map(logosBlockchainNetworkTimestamps.values.map((logosBlockchainNetworkTimestamp) => [logosBlockchainNetworkTimestamp[EntityMetaKey.SelectorKey], logosBlockchainNetworkTimestamp])).values()]}
	getKey={(logosBlockchainNetworkTimestamp) => logosBlockchainNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Logos blockchain network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: logosBlockchainNetworkTimestamp })}
		{@const logosBlockchainNetworkTimestampFields = { ...logosBlockchainNetworkTimestamp[EntityMetaKey.Selector], ...logosBlockchainNetworkTimestamp }}
		<EntityView
			entityType={EntityType.LogosBlockchainNetwork_Timestamp}
			entitySelector={logosBlockchainNetworkTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((logosBlockchainNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Logos blockchain network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((logosBlockchainNetworkTimestampFields.height) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((logosBlockchainNetworkTimestampFields.mode) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
