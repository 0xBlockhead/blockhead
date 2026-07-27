<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.XrplAmm> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'XRPL AMM'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplAmm}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amm/[ammAccount=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				ammAccount: String(selection.entitySelector.ammAccount),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		XRPL AMM
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>AMM account</dt>
				<dd>
					<TruncatedValue value={pendingEntity.ammAccount} />
				</dd>
			</div>

			<div>
				<dt>asset currency</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									assetCurrency: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.assetCurrency}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetIssuer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetIssuer = entity.assetIssuer}
					{#if assetIssuer != null}
						<div>
							<dt>asset issuer</dt>
							<dd>
								<TruncatedValue value={assetIssuer} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>asset2 currency</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									asset2Currency: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.asset2Currency}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							asset2Issuer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const asset2Issuer = entity.asset2Issuer}
					{#if asset2Issuer != null}
						<div>
							<dt>asset2 issuer</dt>
							<dd>
								<TruncatedValue value={asset2Issuer} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lpTokenCurrency: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lpTokenCurrency = entity.lpTokenCurrency}
					{#if lpTokenCurrency != null}
						<div>
							<dt>LP token currency</dt>
							<dd>
								{lpTokenCurrency}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
