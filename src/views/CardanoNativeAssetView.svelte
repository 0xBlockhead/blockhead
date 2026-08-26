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
	}: Omit<EntitySelectionViewProps<EntityType.CardanoNativeAsset>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const cardanoNativeAsset = $derived(selection({
		fields: {
			fingerprint: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.assetName || selection.entitySelector.policyId || 'Cardano native asset')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoNativeAsset}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/native-asset/[policyId=stringSegment]/[assetName=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					policyId: selection.entitySelector.policyId,
					assetName: selection.entitySelector.assetName,
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
		<ResourceBoundary resource={cardanoNativeAsset}>
			{#snippet children(entity)}
				{(entity.fingerprint ?? '') || selection.entitySelector.assetName || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>policy ID</dt>
				<dd>
					{selection.entitySelector.policyId}
				</dd>
			</div>

			<div>
				<dt>asset name</dt>
				<dd>
					{selection.entitySelector.assetName}
				</dd>
			</div>

			<ResourceBoundary
				resource={cardanoNativeAsset}
			>
				{#snippet children(entity)}
					{@const fingerprint = entity.fingerprint}
					{#if fingerprint != null}
						<div>
							<dt>fingerprint</dt>
							<dd>
								{fingerprint}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
