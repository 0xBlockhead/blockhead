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
	}: EntityListViewProps<EntityType.BlockheadAgentCredentialState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentCredentialState_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentCredentialStateTimestamp })}
		{@const blockheadAgentCredentialStateTimestampSelector = blockheadAgentCredentialStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAgentCredentialState_Timestamp}
			entitySelector={blockheadAgentCredentialStateTimestampSelector}
			href={
				resolve(
					'/~/agent/credential/[credentialId=stringSegment]/(blockheadAgentCredentialState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						credentialId: blockheadAgentCredentialStateTimestampSelector.$credential.credentialId,
						timestampMs: String(blockheadAgentCredentialStateTimestampSelector.timestampMs),
						source: blockheadAgentCredentialStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadAgentCredentialStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadAgentCredentialStateTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadAgentCredentialStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
