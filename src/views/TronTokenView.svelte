<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.TronToken>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TronAccountView from '$/views/TronAccountView.svelte'
	import TronContractView from '$/views/TronContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TronToken}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					tokenId: selection.entitySelector.tokenId,
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
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Token ID</dt>
				<dd>
					{selection.entitySelector.tokenId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							standard: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const standard = entity.standard}
					{#if standard != null}
						<div>
							<dt>Standard</dt>
							<dd>
								{standard}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$owner}
			>
				{#snippet children(tronAccount)}
					{#if tronAccount != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<TronAccountView
									selection={select(EntityType.TronAccount, tronAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet children(tronContract)}
					{#if tronContract != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<TronContractView
									selection={select(EntityType.TronContract, tronContract[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
							createdTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdTimestampMs = entity.createdTimestampMs}
					{#if createdTimestampMs != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
