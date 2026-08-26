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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AlgorandAssetHolding_Round>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)
	const asset = $derived(selection.entitySelector.$asset)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandAccountView from '$/views/AlgorandAccountView.svelte'
	import AlgorandAssetView from '$/views/AlgorandAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandAssetHolding_Round}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			(
				'caip2' in asset.$network.$network ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/account/[address=stringSegment]/(algorandAccount)/asset/[assetNetwork=networkCaip2]/[assetId=nonNegativeBigInt]/round/[round=nonNegativeBigInt]/[source=stringSegment]',
						{
							network: (
								'caip2' in account.$network.$network ?
									caip2StringFromValue(account.$network.$network.caip2)
								:
									account.$network.$network.slug
							),
							address: account.address,
							assetNetwork: String(asset.$network.$network.caip2),
							assetId: String(asset.assetId),
							round: String(selection.entitySelector.round),
							source: selection.entitySelector.source,
						}
					)
				:
					undefined
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
				<dt>account</dt>
				<dd>
					<AlgorandAccountView
						selection={select(EntityType.AlgorandAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>asset</dt>
				<dd>
					<AlgorandAssetView
						selection={select(EntityType.AlgorandAsset, selection.entitySelector.$asset)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>round</dt>
				<dd>
					{selection.entitySelector.round}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>amount</dt>
							<dd>
								{amount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							frozen: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const frozen = entity.frozen}
					{#if frozen != null}
						<div>
							<dt>frozen</dt>
							<dd>
								{frozen ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							optedInAtRound: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const optedInAtRound = entity.optedInAtRound}
					{#if optedInAtRound != null}
						<div>
							<dt>opted in AT round</dt>
							<dd>
								{optedInAtRound}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deleted = entity.deleted}
					{#if deleted != null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
