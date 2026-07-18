<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Global IPFS access observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalIpfsAccess_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalIpfsAccess_Timestamp>
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
	import GlobalIpfsAccess_TimestampView from '$/views/_GlobalIpfsAccess_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalIpfsAccess_Timestamp}
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
				$hub: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	getResourceItems={(globalIpfsAccessTimestamps) => [...new Map(globalIpfsAccessTimestamps.values.map((globalIpfsAccessTimestamp) => [globalIpfsAccessTimestamp[EntityMetaKey.SelectorKey], globalIpfsAccessTimestamp])).values()]}
	getKey={(globalIpfsAccessTimestamp) => globalIpfsAccessTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global IPFS access observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalIpfsAccessTimestamp })}
		{@const globalIpfsAccessTimestampFields = { ...globalIpfsAccessTimestamp[EntityMetaKey.Selector], ...globalIpfsAccessTimestamp }}
		{@const selection = select(EntityType._GlobalIpfsAccess_Timestamp, globalIpfsAccessTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const globalIpfsAccessTimestampHrefFields = { ...globalIpfsAccessTimestamp, ...globalIpfsAccessTimestamp[EntityMetaKey.Selector] }}
		<GlobalIpfsAccess_TimestampView
			selection={selection}
			prefetched={globalIpfsAccessTimestampFields}
			href={
				(globalIpfsAccessTimestampHrefFields.timestampMs !== undefined && globalIpfsAccessTimestampHrefFields.source !== undefined ? resolve('/ipfs/access/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(globalIpfsAccessTimestampHrefFields.timestampMs ?? ''),
					source: String(globalIpfsAccessTimestampHrefFields.source ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
