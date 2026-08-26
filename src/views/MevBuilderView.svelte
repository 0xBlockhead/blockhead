<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.MevBuilder>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MevRelay_ProposerPayloadDeliveredsView from '$/views/MevRelay_ProposerPayloadDeliveredsView.svelte'
	import MevRelay_BuilderBlockReceivedsView from '$/views/MevRelay_BuilderBlockReceivedsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.MevBuilder}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.builderPubkey || 'MEV builder')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					builderPubkey: selection.entitySelector.builderPubkey,
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
		<TruncatedValue value={selection.entitySelector.builderPubkey} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.builderPubkey} />
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
				<dt>Builder public key</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.builderPubkey} />
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EntitiesList
						entityType={EntityType.MevBuilder_Timestamp}
						countResource={timestampsResource.count}
						title='Timestamps'
						open={true}
						id='timestamps'
						resource={timestampsResource()}
					>
						{#snippet Item({ item: mevBuilderTimestamp })}
							<EntityView
								entityType={EntityType.MevBuilder_Timestamp}
								entitySelector={mevBuilderTimestamp[EntityMetaKey.Selector]}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const deliveredPayloadsResource = selection.$$deliveredPayloads}
		<ResourceBoundary
			resource={deliveredPayloadsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MevRelay_ProposerPayloadDeliveredsView
						selection={deliveredPayloadsResource}
						countResource={deliveredPayloadsResource.count}
						title='Delivered payloads'
						id='delivered-payloads'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const receivedBidsResource = selection.$$receivedBids}
		<ResourceBoundary
			resource={receivedBidsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MevRelay_BuilderBlockReceivedsView
						selection={receivedBidsResource}
						countResource={receivedBidsResource.count}
						title='Received bids'
						id='received-bids'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
