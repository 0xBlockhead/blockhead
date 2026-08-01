<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ActivityPubInstancePeer>, 'prefetched'> = $props()


	// Components
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
	{#snippet Value()}
		<ActivityPubInstance_TimestampView
			selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Observation</dt>
				<dd>
					<ActivityPubInstance_TimestampView
						selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation)}
						layout={EntityLayout.Value}
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
