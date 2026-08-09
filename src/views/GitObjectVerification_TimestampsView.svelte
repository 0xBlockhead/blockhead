<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.GitObjectVerification_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitObjectVerification_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					objectId: true,
					status: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: gitObjectVerificationTimestamp })}
		{@const gitObjectVerificationTimestampSelector = gitObjectVerificationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitObjectVerification_Timestamp}
			entitySelector={gitObjectVerificationTimestampSelector}
			href={
				resolve(
					'/git/object/[objectId=zeroExHex]/[objectFormat=stringSegment]/(gitObject)/byte-source/[byteSource=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						objectId: gitObjectVerificationTimestampSelector.objectId,
						objectFormat: gitObjectVerificationTimestampSelector.objectFormat,
						byteSource: gitObjectVerificationTimestampSelector.byteSource,
						timestampMs: String(gitObjectVerificationTimestampSelector.timestampMs),
						source: gitObjectVerificationTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{gitObjectVerificationTimestampSelector.objectId || 'Git object verification timestamp'}
			{/snippet}

			{#snippet Value()}
				{gitObjectVerificationTimestamp.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{gitObjectVerificationTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
