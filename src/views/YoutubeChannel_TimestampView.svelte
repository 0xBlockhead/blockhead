<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.YoutubeChannel_Timestamp> = $props()


	// Components
	import Timestamp from '$/components/Timestamp.svelte'
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubeChannel_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? ([String(selection.entitySelector.timestampMs), selection.entitySelector.source].filter(Boolean).join(' ') || 'YouTube channel observation')}
	href={
		href === undefined ?
			resolve(
				'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
				{
					channelId: encodeURIComponent(selection.entitySelector.$channel.channelId),
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<YoutubeChannelView
			selection={select(EntityType.YoutubeChannel, selection.entitySelector.$channel)}
			href={null}
			layout={EntityLayout.Title}
		/>

		<Timestamp timestamp={selection.entitySelector.timestampMs} />
		{selection.entitySelector.source}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
