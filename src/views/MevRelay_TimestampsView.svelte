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
		title = 'MEV relay observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevRelay_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.MevRelay_Timestamp>
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
	entityType={EntityType.MevRelay_Timestamp}
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
				reachable: true,
				statusCode: true,
				timestampMs: true,
				$relay: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(mevRelayTimestamps) => [...new Map(mevRelayTimestamps.values.map((mevRelayTimestamp) => [mevRelayTimestamp[EntityMetaKey.SelectorKey], mevRelayTimestamp])).values()]}
	getKey={(mevRelayTimestamp) => mevRelayTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No MEV relay observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: mevRelayTimestamp })}
		{@const mevRelayTimestampFields = { ...mevRelayTimestamp[EntityMetaKey.Selector], ...mevRelayTimestamp }}
		<EntityView
			entityType={EntityType.MevRelay_Timestamp}
			entitySelector={mevRelayTimestamp[EntityMetaKey.Selector]}
			href={
				(
					mevRelayTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in mevRelayTimestamp[EntityMetaKey.Selector]
					&& mevRelayTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& mevRelayTimestamp[EntityMetaKey.Selector] != null && 'source' in mevRelayTimestamp[EntityMetaKey.Selector]
					&& mevRelayTimestamp[EntityMetaKey.Selector].source != null
					&& mevRelayTimestamp[EntityMetaKey.Selector] != null && '$relay' in mevRelayTimestamp[EntityMetaKey.Selector]
					&& mevRelayTimestamp[EntityMetaKey.Selector].$relay != null && 'host' in mevRelayTimestamp[EntityMetaKey.Selector].$relay
					&& mevRelayTimestamp[EntityMetaKey.Selector].$relay.host != null
					&& mevRelayTimestamp[EntityMetaKey.Selector].$relay != null && '$network' in mevRelayTimestamp[EntityMetaKey.Selector].$relay ?
						mevRelayTimestamp[EntityMetaKey.Selector].$relay.$network != null && 'caip2' in mevRelayTimestamp[EntityMetaKey.Selector].$relay.$network
						&& mevRelayTimestamp[EntityMetaKey.Selector].$relay.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(mevRelayTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(mevRelayTimestamp[EntityMetaKey.Selector].source ?? ''),
						host: String(mevRelayTimestamp[EntityMetaKey.Selector].$relay.host ?? ''),
						network: String(caip2StringFromValue(mevRelayTimestamp[EntityMetaKey.Selector].$relay.$network.caip2) ?? ''),
					})
					:
							mevRelayTimestamp[EntityMetaKey.Selector].$relay.$network != null && 'slug' in mevRelayTimestamp[EntityMetaKey.Selector].$relay.$network
							&& mevRelayTimestamp[EntityMetaKey.Selector].$relay.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(mevRelayTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(mevRelayTimestamp[EntityMetaKey.Selector].source ?? ''),
							host: String(mevRelayTimestamp[EntityMetaKey.Selector].$relay.host ?? ''),
							network: String(mevRelayTimestamp[EntityMetaKey.Selector].$relay.$network.slug ?? ''),
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
				{[String((mevRelayTimestampFields.reachable) ?? ''), String((mevRelayTimestampFields.statusCode) ?? ''), String((mevRelayTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'MEV relay timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((mevRelayTimestampFields.reachable) ?? ''), String((mevRelayTimestampFields.statusCode) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((mevRelayTimestampFields.$relay.host) ?? '')].filter(Boolean).join(' ') || 'MEV relay'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
