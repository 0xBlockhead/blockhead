<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Filecoin actor observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FilecoinActor_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FilecoinActor_Timestamp>
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
	import FilecoinActor_TimestampView from '$/views/FilecoinActor_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinActor_Timestamp}
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
				balanceAttoFil: true,
				height: true,
				tipsetKey: true,
				source: true,
				$actor: true,
			},
		})
	}
	getResourceItems={(filecoinActorTimestamps) => [...new Map(filecoinActorTimestamps.values.map((filecoinActorTimestamp) => [filecoinActorTimestamp[EntityMetaKey.SelectorKey], filecoinActorTimestamp])).values()]}
	getKey={(filecoinActorTimestamp) => filecoinActorTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Filecoin actor observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: filecoinActorTimestamp })}
		{@const filecoinActorTimestampFields = { ...filecoinActorTimestamp[EntityMetaKey.Selector], ...filecoinActorTimestamp }}
		{@const selection = select(EntityType.FilecoinActor_Timestamp, filecoinActorTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const filecoinActorTimestampHrefFields = { ...filecoinActorTimestamp, ...filecoinActorTimestamp[EntityMetaKey.Selector] }}
		<FilecoinActor_TimestampView
			selection={selection}
			prefetched={filecoinActorTimestampFields}
			href={
				(filecoinActorTimestampHrefFields.height !== undefined && filecoinActorTimestampHrefFields.tipsetKey !== undefined && filecoinActorTimestampHrefFields.source !== undefined && filecoinActorTimestampHrefFields.$actor !== undefined && filecoinActorTimestampHrefFields.$actor.address !== undefined && filecoinActorTimestampHrefFields.$actor.$network !== undefined && filecoinActorTimestampHrefFields.$actor.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
					height: String(filecoinActorTimestampHrefFields.height ?? ''),
					tipsetKey: String(filecoinActorTimestampHrefFields.tipsetKey ?? ''),
					source: String(filecoinActorTimestampHrefFields.source ?? ''),
					address: String(filecoinActorTimestampHrefFields.$actor.address ?? ''),
					network: String(caip2StringFromValue(filecoinActorTimestampHrefFields.$actor.$network.caip2) ?? ''),
				}) : filecoinActorTimestampHrefFields.height !== undefined && filecoinActorTimestampHrefFields.tipsetKey !== undefined && filecoinActorTimestampHrefFields.source !== undefined && filecoinActorTimestampHrefFields.$actor !== undefined && filecoinActorTimestampHrefFields.$actor.address !== undefined && filecoinActorTimestampHrefFields.$actor.$network !== undefined && filecoinActorTimestampHrefFields.$actor.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
					height: String(filecoinActorTimestampHrefFields.height ?? ''),
					tipsetKey: String(filecoinActorTimestampHrefFields.tipsetKey ?? ''),
					source: String(filecoinActorTimestampHrefFields.source ?? ''),
					address: String(filecoinActorTimestampHrefFields.$actor.address ?? ''),
					network: String(filecoinActorTimestampHrefFields.$actor.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
