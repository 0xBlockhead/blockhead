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
	}: EntityListViewProps<EntityType.XrplAmendment> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplAmendment}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplAmendment })}
		{@const xrplAmendmentSelector = xrplAmendment[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XrplAmendment}
			entitySelector={xrplAmendmentSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amendment/[amendmentId=stringSegment]',
					{
						network: (
							'caip2' in xrplAmendmentSelector.$network ?
								String(caip2StringFromValue(xrplAmendmentSelector.$network.caip2))
							:
								String(xrplAmendmentSelector.$network.slug)
						),
						amendmentId: String(xrplAmendmentSelector.amendmentId),
					}
				)
			}
		>
			{#snippet Title()}
				XRPL amendment
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
