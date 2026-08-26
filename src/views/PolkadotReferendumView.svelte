<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.PolkadotReferendum>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const polkadotReferendum = $derived(selection({
		fields: {
			track: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.referendumId || 'Polkadot referendum')


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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(polkadot)/referendum/[referendumId=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					referendumId: selection.entitySelector.referendumId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={polkadotReferendum}>
			{#snippet children(entity)}
				{(entity.track ?? '') || selection.entitySelector.referendumId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Referendum ID</dt>
				<dd>
					{selection.entitySelector.referendumId}
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

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<PolkadotReferendum_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Lifecycle observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
