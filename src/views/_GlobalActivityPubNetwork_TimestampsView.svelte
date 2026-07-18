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
		title = 'ActivityPub hub observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalActivityPubNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalActivityPubNetwork_Timestamp>
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
	import GlobalActivityPubNetwork_TimestampView from '$/views/_GlobalActivityPubNetwork_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalActivityPubNetwork_Timestamp}
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
				instanceTitle: true,
				timestampMs: true,
				instanceOrigin: true,
				source: true,
				reachable: true,
			},
		})
	}
	getResourceItems={(globalActivityPubNetworkTimestamps) => [...new Map(globalActivityPubNetworkTimestamps.values.map((globalActivityPubNetworkTimestamp) => [globalActivityPubNetworkTimestamp[EntityMetaKey.SelectorKey], globalActivityPubNetworkTimestamp])).values()]}
	getKey={(globalActivityPubNetworkTimestamp) => globalActivityPubNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global ActivityPub network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalActivityPubNetworkTimestamp })}
		{@const globalActivityPubNetworkTimestampFields = { ...globalActivityPubNetworkTimestamp[EntityMetaKey.Selector], ...globalActivityPubNetworkTimestamp }}
		{@const selection = select(EntityType._GlobalActivityPubNetwork_Timestamp, globalActivityPubNetworkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<GlobalActivityPubNetwork_TimestampView
			selection={selection}
			prefetched={globalActivityPubNetworkTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
