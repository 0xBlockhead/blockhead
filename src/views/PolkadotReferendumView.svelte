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
	}: EntitySelectionViewProps<EntityType.PolkadotReferendum> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const polkadotReferendum = $derived(selection({
		fields: {
			track: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.referendumId ?? '') || 'Polkadot referendum')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import PolkadotReferendum_TimestampsView from '$/views/PolkadotReferendum_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotReferendum}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.referendumId ?? '') || 'Polkadot referendum'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotReferendum}>
			{#snippet children(entity)}
				{(entity.track ?? '') || pendingEntity.referendumId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Referendum ID</dt>
				<dd>
					{pendingEntity.referendumId}
				</dd>
			</div>

			<ResourceBoundary
				resource={polkadotReferendum}
			>
				{#snippet children(entity)}
					{@const track = entity.track}
					{#if track != null}
						<div>
							<dt>Track</dt>
							<dd>
								{track}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							submittedAtBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const submittedAtBlockNumber = entity.submittedAtBlockNumber}
					{#if submittedAtBlockNumber != null}
						<div>
							<dt>Submitted at block number</dt>
							<dd>
								<NumberValue
									value={submittedAtBlockNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const polkadotReferendumPolkadotReferendumTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={polkadotReferendumPolkadotReferendumTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<PolkadotReferendum_TimestampsView
						selection={polkadotReferendumPolkadotReferendumTimestampsViewTimestampsResource}
						countResource={polkadotReferendumPolkadotReferendumTimestampsViewTimestampsResource.count}
						title='Lifecycle observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
