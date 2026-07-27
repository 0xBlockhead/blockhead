<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmTopic_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmTopic_Timestamp}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Openchain_Rest,
			],
			fields: {
				signatures: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: evmTopicTimestamp })}
		{@const evmTopicTimestampSelector = evmTopicTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmTopic_Timestamp}
			entitySelector={evmTopicTimestampSelector}
			href={
				resolve(
					'/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]/(evmTopic)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						hex: String(evmTopicTimestampSelector.$topic.hex),
						timestampMs: String(evmTopicTimestampSelector.timestampMs),
						source: String(evmTopicTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{evmTopicTimestamp.signatures.values.join(', ') || 'EVM topic observation'}
			{/snippet}

			{#snippet Value()}
				{String(evmTopicTimestampSelector.timestampMs)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmTopicTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
