<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.MevBuilder_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MevBuilder_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				deliveredPayloadCount: true,
				deliveredValueWei: true,
				$builder: true,
			},
		})
	}
>
	{#snippet Item({ item: mevBuilderTimestamp })}
		{@const mevBuilderTimestampSelector = mevBuilderTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MevBuilder_Timestamp}
			entitySelector={mevBuilderTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]/(mevBuilder)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in mevBuilderTimestampSelector.$builder.$network ?
								String(caip2StringFromValue(mevBuilderTimestampSelector.$builder.$network.caip2))
							:
								String(mevBuilderTimestampSelector.$builder.$network.slug)
						),
						builderPubkey: String(mevBuilderTimestampSelector.$builder.builderPubkey),
						timestampMs: String(mevBuilderTimestampSelector.timestampMs),
						source: String(mevBuilderTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{([(String(mevBuilderTimestamp.deliveredPayloadCount ?? '') ? String(mevBuilderTimestamp.deliveredPayloadCount ?? '') + ' payloads' : ''), (String(mevBuilderTimestamp.deliveredValueWei ?? '') ? String(mevBuilderTimestamp.deliveredValueWei ?? '') + ' wei' : '')].filter(Boolean).join(' ')) || 'MEV builder timestamp'}
			{/snippet}

			{#snippet Value()}
				{(String(mevBuilderTimestamp.deliveredPayloadCount ?? '') ? String(mevBuilderTimestamp.deliveredPayloadCount ?? '') + ' payloads' : '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mevBuilderTimestampSelector.$builder.builderPubkey || 'MEV builder'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
