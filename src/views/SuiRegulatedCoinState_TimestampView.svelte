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
	}: Omit<EntitySelectionViewProps<EntityType.SuiRegulatedCoinState_Timestamp>, 'prefetched'> = $props()

	const coinType = $derived(selection.entitySelector.$coinType)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SuiCoinTypeView from '$/views/SuiCoinTypeView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiRegulatedCoinState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/coin-type/[coinType=stringSegment]/(suiCoinType)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in coinType.$network.$network ?
							caip2StringFromValue(coinType.$network.$network.caip2)
						:
							coinType.$network.$network.slug
					),
					coinType: coinType.coinType,
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
		{selection.entitySelector.source || String(selection.entitySelector.timestampMs)}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<SuiCoinTypeView
				selection={select(EntityType.SuiCoinType, selection.entitySelector.$coinType)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>coin type</dt>
				<dd>
					<SuiCoinTypeView
						selection={select(EntityType.SuiCoinType, selection.entitySelector.$coinType)}
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
							denyCapObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const denyCapObjectId = entity.denyCapObjectId}
					{#if denyCapObjectId != null}
						<div>
							<dt>deny cap object ID</dt>
							<dd>
								{denyCapObjectId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
