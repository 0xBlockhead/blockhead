<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Network observations',
		typeAnnotationParagraphs = ['A point-in-time observation of network status or metrics.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Network_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Network_Timestamp>
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
	entityType={EntityType.Network_Timestamp}
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
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(networkTimestamps) => [...new Map(networkTimestamps.values.map((networkTimestamp) => [networkTimestamp[EntityMetaKey.SelectorKey], networkTimestamp])).values()]}
	getKey={(networkTimestamp) => networkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: networkTimestamp })}
		{@const networkTimestampFields = { ...networkTimestamp[EntityMetaKey.Selector], ...networkTimestamp }}
		<EntityView
			entityType={EntityType.Network_Timestamp}
			entitySelector={networkTimestamp[EntityMetaKey.Selector]}
			href={
				(
					networkTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in networkTimestamp[EntityMetaKey.Selector]
					&& networkTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& networkTimestamp[EntityMetaKey.Selector] != null && 'source' in networkTimestamp[EntityMetaKey.Selector]
					&& networkTimestamp[EntityMetaKey.Selector].source != null
					&& networkTimestamp[EntityMetaKey.Selector] != null && '$network' in networkTimestamp[EntityMetaKey.Selector] ?
						networkTimestamp[EntityMetaKey.Selector].$network != null && 'caip2' in networkTimestamp[EntityMetaKey.Selector].$network
						&& networkTimestamp[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(networkTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(networkTimestamp[EntityMetaKey.Selector].source ?? ''),
						network: String(caip2StringFromValue(networkTimestamp[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							networkTimestamp[EntityMetaKey.Selector].$network != null && 'slug' in networkTimestamp[EntityMetaKey.Selector].$network
							&& networkTimestamp[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(networkTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(networkTimestamp[EntityMetaKey.Selector].source ?? ''),
							network: String(networkTimestamp[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((networkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((networkTimestampFields.source) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
