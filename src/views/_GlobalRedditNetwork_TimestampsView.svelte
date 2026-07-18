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
		title = 'Reddit observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalRedditNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalRedditNetwork_Timestamp>
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
	import GlobalRedditNetwork_TimestampView from '$/views/_GlobalRedditNetwork_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalRedditNetwork_Timestamp}
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
				source: true,
				reachable: true,
				observedLinkCount: true,
			},
		})
	}
	getResourceItems={(globalRedditNetworkTimestamps) => [...new Map(globalRedditNetworkTimestamps.values.map((globalRedditNetworkTimestamp) => [globalRedditNetworkTimestamp[EntityMetaKey.SelectorKey], globalRedditNetworkTimestamp])).values()]}
	getKey={(globalRedditNetworkTimestamp) => globalRedditNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global Reddit network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalRedditNetworkTimestamp })}
		{@const globalRedditNetworkTimestampFields = { ...globalRedditNetworkTimestamp[EntityMetaKey.Selector], ...globalRedditNetworkTimestamp }}
		{@const selection = select(EntityType._GlobalRedditNetwork_Timestamp, globalRedditNetworkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<GlobalRedditNetwork_TimestampView
			selection={selection}
			prefetched={globalRedditNetworkTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
