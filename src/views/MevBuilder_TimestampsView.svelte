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
		title = 'MEV builder observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevBuilder_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.MevBuilder_Timestamp>
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
	entityType={EntityType.MevBuilder_Timestamp}
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
				deliveredPayloadCount: true,
				deliveredValueWei: true,
				$builder: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(mevBuilderTimestamps) => [...new Map(mevBuilderTimestamps.values.map((mevBuilderTimestamp) => [mevBuilderTimestamp[EntityMetaKey.SelectorKey], mevBuilderTimestamp])).values()]}
	getKey={(mevBuilderTimestamp) => mevBuilderTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No MEV builder observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: mevBuilderTimestamp })}
		{@const mevBuilderTimestampFields = { ...mevBuilderTimestamp[EntityMetaKey.Selector], ...mevBuilderTimestamp }}
		<EntityView
			entityType={EntityType.MevBuilder_Timestamp}
			entitySelector={mevBuilderTimestamp[EntityMetaKey.Selector]}
			href={
				(
					mevBuilderTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in mevBuilderTimestamp[EntityMetaKey.Selector]
					&& mevBuilderTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& mevBuilderTimestamp[EntityMetaKey.Selector] != null && 'source' in mevBuilderTimestamp[EntityMetaKey.Selector]
					&& mevBuilderTimestamp[EntityMetaKey.Selector].source != null
					&& mevBuilderTimestamp[EntityMetaKey.Selector] != null && '$builder' in mevBuilderTimestamp[EntityMetaKey.Selector]
					&& mevBuilderTimestamp[EntityMetaKey.Selector].$builder != null && 'builderPubkey' in mevBuilderTimestamp[EntityMetaKey.Selector].$builder
					&& mevBuilderTimestamp[EntityMetaKey.Selector].$builder.builderPubkey != null
					&& mevBuilderTimestamp[EntityMetaKey.Selector].$builder != null && '$network' in mevBuilderTimestamp[EntityMetaKey.Selector].$builder ?
						mevBuilderTimestamp[EntityMetaKey.Selector].$builder.$network != null && 'caip2' in mevBuilderTimestamp[EntityMetaKey.Selector].$builder.$network
						&& mevBuilderTimestamp[EntityMetaKey.Selector].$builder.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(mevBuilderTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(mevBuilderTimestamp[EntityMetaKey.Selector].source ?? ''),
						builderPubkey: String(mevBuilderTimestamp[EntityMetaKey.Selector].$builder.builderPubkey ?? ''),
						network: String(caip2StringFromValue(mevBuilderTimestamp[EntityMetaKey.Selector].$builder.$network.caip2) ?? ''),
					})
					:
							mevBuilderTimestamp[EntityMetaKey.Selector].$builder.$network != null && 'slug' in mevBuilderTimestamp[EntityMetaKey.Selector].$builder.$network
							&& mevBuilderTimestamp[EntityMetaKey.Selector].$builder.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(mevBuilderTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(mevBuilderTimestamp[EntityMetaKey.Selector].source ?? ''),
							builderPubkey: String(mevBuilderTimestamp[EntityMetaKey.Selector].$builder.builderPubkey ?? ''),
							network: String(mevBuilderTimestamp[EntityMetaKey.Selector].$builder.$network.slug ?? ''),
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
				{[(String((mevBuilderTimestampFields.deliveredPayloadCount) ?? '') ? String((mevBuilderTimestampFields.deliveredPayloadCount) ?? '') + ' payloads' : ''), (String((mevBuilderTimestampFields.deliveredValueWei) ?? '') ? String((mevBuilderTimestampFields.deliveredValueWei) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'MEV builder timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(String((mevBuilderTimestampFields.deliveredPayloadCount) ?? '') ? String((mevBuilderTimestampFields.deliveredPayloadCount) ?? '') + ' payloads' : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((mevBuilderTimestampFields.$builder.builderPubkey) ?? '')].filter(Boolean).join(' ') || 'MEV builder'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
