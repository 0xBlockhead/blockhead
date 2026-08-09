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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TronWitness_Timestamp>, 'prefetched'> = $props()

	const witness = $derived(selection.entitySelector.$witness)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TronWitnessView from '$/views/TronWitnessView.svelte'
</script>


<EntityView
	entityType={EntityType.TronWitness_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/witness/[address=stringSegment]/(tronWitness)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in witness.$network ?
							caip2StringFromValue(witness.$network.caip2)
						:
							witness.$network.slug
					),
					address: witness.address,
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
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Witness</dt>
				<dd>
					<TronWitnessView
						selection={select(EntityType.TronWitness, selection.entitySelector.$witness)}
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
				resource={
					selection({
						fields: {
							url: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const url = entity.url}
					{#if url != null}
						<div>
							<dt>URL</dt>
							<dd>
								<a
									href={url}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={url} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							voteCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const voteCount = entity.voteCount}
					{#if voteCount != null}
						<div>
							<dt>Votes</dt>
							<dd>
								{voteCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalProduced: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalProduced = entity.totalProduced}
					{#if totalProduced != null}
						<div>
							<dt>Total produced</dt>
							<dd>
								{totalProduced}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalMissed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalMissed = entity.totalMissed}
					{#if totalMissed != null}
						<div>
							<dt>Total missed</dt>
							<dd>
								{totalMissed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockHeight = entity.latestBlockHeight}
					{#if latestBlockHeight != null}
						<div>
							<dt>Latest block height</dt>
							<dd>
								{latestBlockHeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestSlotNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestSlotNumber = entity.latestSlotNumber}
					{#if latestSlotNumber != null}
						<div>
							<dt>Latest slot number</dt>
							<dd>
								{latestSlotNumber}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const active = entity.active}
					{#if active != null}
						<div>
							<dt>Active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
