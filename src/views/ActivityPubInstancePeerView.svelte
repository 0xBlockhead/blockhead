<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ActivityPubInstancePeer> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActivityPubInstance_TimestampView from '$/views/ActivityPubInstance_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstancePeer}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.peerDomain || 'ActivityPub instance peer')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.peerDomain || 'ActivityPub instance peer'}
	{/snippet}

	{#snippet Value()}
		<ActivityPubInstance_TimestampView
			selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation)}
			href={null}
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A domain that a declared ActivityPub instance reports as a known connected domain.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Observation</dt>
				<dd>
					<ActivityPubInstance_TimestampView
						selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Peer domain</dt>
				<dd>
					{selection.entitySelector.peerDomain}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
