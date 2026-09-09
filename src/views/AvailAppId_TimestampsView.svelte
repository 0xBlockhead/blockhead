<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.AvailAppId_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvailAppId_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				dataSubmissionCount: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: availAppIdTimestamp })}
		{@const availAppIdTimestampSelector = availAppIdTimestamp[EntityMetaKey.Selector]}
		{@const appId = availAppIdTimestampSelector.$appId}
		<EntityView
			entityType={EntityType.AvailAppId_Timestamp}
			entitySelector={availAppIdTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/app/[appId=nonNegativeInteger]/(availAppId)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in appId.$network.$network ?
								caip2StringFromValue(appId.$network.$network.caip2)
							:
								appId.$network.$network.slug
						),
						appId: String(appId.appId),
						timestampMs: String(availAppIdTimestampSelector.timestampMs),
						source: availAppIdTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{availAppIdTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{availAppIdTimestamp.dataSubmissionCount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{availAppIdTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
