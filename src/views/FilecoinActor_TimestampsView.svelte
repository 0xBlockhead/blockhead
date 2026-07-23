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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FilecoinActor_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.FilecoinActor_Timestamp}
			entitySelector={filecoinActorTimestamp[EntityMetaKey.Selector]}
			href={
				(
					filecoinActorTimestamp[EntityMetaKey.Selector] != null && 'height' in filecoinActorTimestamp[EntityMetaKey.Selector]
					&& filecoinActorTimestamp[EntityMetaKey.Selector].height != null
					&& filecoinActorTimestamp[EntityMetaKey.Selector] != null && 'tipsetKey' in filecoinActorTimestamp[EntityMetaKey.Selector]
					&& filecoinActorTimestamp[EntityMetaKey.Selector].tipsetKey != null
					&& filecoinActorTimestamp[EntityMetaKey.Selector] != null && 'source' in filecoinActorTimestamp[EntityMetaKey.Selector]
					&& filecoinActorTimestamp[EntityMetaKey.Selector].source != null
					&& filecoinActorTimestamp[EntityMetaKey.Selector] != null && '$actor' in filecoinActorTimestamp[EntityMetaKey.Selector]
					&& filecoinActorTimestamp[EntityMetaKey.Selector].$actor != null && 'address' in filecoinActorTimestamp[EntityMetaKey.Selector].$actor
					&& filecoinActorTimestamp[EntityMetaKey.Selector].$actor.address != null
					&& filecoinActorTimestamp[EntityMetaKey.Selector].$actor != null && '$network' in filecoinActorTimestamp[EntityMetaKey.Selector].$actor ?
						filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network != null && 'caip2' in filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network
						&& filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
						height: String(filecoinActorTimestamp[EntityMetaKey.Selector].height ?? ''),
						tipsetKey: String(filecoinActorTimestamp[EntityMetaKey.Selector].tipsetKey ?? ''),
						source: String(filecoinActorTimestamp[EntityMetaKey.Selector].source ?? ''),
						address: String(filecoinActorTimestamp[EntityMetaKey.Selector].$actor.address ?? ''),
						network: String(caip2StringFromValue(filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network.caip2) ?? ''),
					})
					:
							filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network != null && 'slug' in filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network
							&& filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
							height: String(filecoinActorTimestamp[EntityMetaKey.Selector].height ?? ''),
							tipsetKey: String(filecoinActorTimestamp[EntityMetaKey.Selector].tipsetKey ?? ''),
							source: String(filecoinActorTimestamp[EntityMetaKey.Selector].source ?? ''),
							address: String(filecoinActorTimestamp[EntityMetaKey.Selector].$actor.address ?? ''),
							network: String(filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network.slug ?? ''),
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
				{[String((filecoinActorTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin actor timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((filecoinActorTimestampFields.balanceAttoFil) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((filecoinActorTimestampFields.height) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
