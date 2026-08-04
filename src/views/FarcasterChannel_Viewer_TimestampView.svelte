<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.FarcasterChannel_Viewer_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterChannel_Viewer_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Farcaster channel viewer observation'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<FarcasterChannelView
			selection={select(EntityType.FarcasterChannel, selection.entitySelector.$channel)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<FarcasterUserView
			selection={select(EntityType.FarcasterUser, selection.entitySelector.$viewer)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>

		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Channel</dt>
				<dd>
					<FarcasterChannelView
						selection={select(EntityType.FarcasterChannel, selection.entitySelector.$channel)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Viewer</dt>
				<dd>
					<FarcasterUserView
						selection={select(EntityType.FarcasterUser, selection.entitySelector.$viewer)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							following: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const following = entity.following}
					{#if following != null}
						<div>
							<dt>Following</dt>
							<dd>
								{following ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							member: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const member = entity.member}
					{#if member != null}
						<div>
							<dt>Member</dt>
							<dd>
								{member ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							role: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const role = entity.role}
					{#if role != null}
						<div>
							<dt>Role</dt>
							<dd>
								{role}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							followedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const followedAt = entity.followedAt}
					{#if followedAt != null}
						<div>
							<dt>Followed</dt>
							<dd>
								<Timestamp timestamp={followedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							memberAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memberAt = entity.memberAt}
					{#if memberAt != null}
						<div>
							<dt>Member since</dt>
							<dd>
								<Timestamp timestamp={memberAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

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
