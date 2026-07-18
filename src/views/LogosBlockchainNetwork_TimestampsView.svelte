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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.LogosBlockchainNetwork_Timestamp>
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
	import LogosBlockchainNetwork_TimestampView from '$/views/LogosBlockchainNetwork_TimestampView.svelte'
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
		{@const selection = select(EntityType.LogosBlockchainNetwork_Timestamp, logosBlockchainNetworkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<LogosBlockchainNetwork_TimestampView
			selection={selection}
			prefetched={logosBlockchainNetworkTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
