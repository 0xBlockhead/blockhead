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
	}: EntityListViewProps<EntityType.HederaScheduleSignature> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaScheduleSignature}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaScheduleSignature })}
		{@const hederaScheduleSignatureSelector = hederaScheduleSignature[EntityMetaKey.Selector]}
		{@const schedule = hederaScheduleSignatureSelector.$schedule}
		<EntityView
			entityType={EntityType.HederaScheduleSignature}
			entitySelector={hederaScheduleSignatureSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/schedule/[scheduleId=stringSegment]/(hederaSchedule)/signature/[publicKeyPrefix=stringSegment]',
					{
						network: (
							'caip2' in schedule.$network ?
								caip2StringFromValue(schedule.$network.caip2)
							:
								schedule.$network.slug
						),
						scheduleId: schedule.scheduleId,
						publicKeyPrefix: hederaScheduleSignatureSelector.publicKeyPrefix,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
