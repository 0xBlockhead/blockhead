<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.NetworkUpgrade_Timestamp>, 'prefetched'> = $props()

	const upgrade = $derived(selection.entitySelector.$upgrade)
	const networkUpgradeTimestamp = $derived(selection({
		fields: {
			status: true,
			activationHeight: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkUpgradeView from '$/views/NetworkUpgradeView.svelte'
</script>


<EntityView
	entityType={EntityType.NetworkUpgrade_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/upgrade/id/[upgradeId=stringSegment]/(networkUpgrade)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in upgrade.$network ?
							caip2StringFromValue(upgrade.$network.caip2)
						:
							upgrade.$network.slug
					),
					upgradeId: upgrade.upgradeId,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={networkUpgradeTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={networkUpgradeTimestamp}>
			{#snippet children(entity)}
				{@const activationHeight = entity.activationHeight}
				{#if activationHeight != null}
					<span data-text="muted">
						<NumberValue
							value={activationHeight}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Upgrade</dt>
				<dd>
					<NetworkUpgradeView
						selection={select(EntityType.NetworkUpgrade, selection.entitySelector.$upgrade)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

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

			<ResourceBoundary
				resource={networkUpgradeTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={networkUpgradeTimestamp}
			>
				{#snippet children(entity)}
					{@const activationHeight = entity.activationHeight}
					{#if activationHeight != null}
						<div>
							<dt>Activation height</dt>
							<dd>
								<NumberValue
									value={activationHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activationTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activationTimestampMs = entity.activationTimestampMs}
					{#if activationTimestampMs != null}
						<div>
							<dt>Activation timestamp</dt>
							<dd>
								<Timestamp timestamp={activationTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
