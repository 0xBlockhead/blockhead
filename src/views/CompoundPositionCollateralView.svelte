<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.CompoundPositionCollateral>, 'prefetched'> = $props()

	const position = $derived(selection.entitySelector.$position)
	const compoundPositionCollateral = $derived(selection({
		sources: selection.sources ?? [
			Source.Compound_Rest,
		],
		fields: {
			balance: true,
		},
	}))
	const titleFallback = 'Compound position collateral'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CompoundPositionView from '$/views/CompoundPositionView.svelte'
	import CompoundCometAssetView from '$/views/CompoundCometAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.CompoundPositionCollateral}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/compound-comet/[cometAddress=evmAddress]/(compoundComet)/position/[accountAddress=evmAddress]/(compoundPosition)/collateral/[symbol=stringSegment]',
				{
					network: (
						position.$comet.$network.caip2 !== undefined ?
							caip2StringFromValue(position.$comet.$network.caip2)
						:
							position.$comet.$network.slug
					),
					cometAddress: position.$comet.cometAddress,
					accountAddress: position.$account.$actor.address,
					symbol: selection.entitySelector.$asset.symbol,
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
		<CompoundCometAssetView
			selection={select(EntityType.CompoundCometAsset, selection.entitySelector.$asset)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={compoundPositionCollateral}>
			{#snippet children(entity)}
				{entity.balance || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Position</dt>
				<dd>
					<CompoundPositionView
						selection={select(EntityType.CompoundPosition, selection.entitySelector.$position)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Asset</dt>
				<dd>
					<CompoundCometAssetView
						selection={select(EntityType.CompoundCometAsset, selection.entitySelector.$asset)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Balance</dt>
				<dd>
					<ResourceBoundary
						resource={compoundPositionCollateral}
					>
						{#snippet children(entity)}
							{entity.balance}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
