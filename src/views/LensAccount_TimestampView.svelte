<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.LensAccount_Timestamp>, 'prefetched'> = $props()


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.LensAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Lens account observation'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<LensAccountView
			selection={select(EntityType.LensAccount, selection.entitySelector.$account)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<LensAccountView
						selection={select(EntityType.LensAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							followerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const followerCount = entity.followerCount}
					{#if followerCount != null}
						<div>
							<dt>Followers</dt>
							<dd>
								<NumberValue
									value={followerCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							followingCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const followingCount = entity.followingCount}
					{#if followingCount != null}
						<div>
							<dt>Following</dt>
							<dd>
								<NumberValue
									value={followingCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
