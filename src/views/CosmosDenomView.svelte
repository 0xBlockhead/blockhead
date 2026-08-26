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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CosmosDenom> = $props()

	const network = $derived(selection.entitySelector.$network)
	const cosmosDenom = $derived(selection({
		fields: {
			symbol: true,
			display: true,
		},
	}))
	const titleFallback = $derived([(prefetched.symbol ?? ''), (prefetched.display ?? ''), selection.entitySelector.denom].filter(Boolean).join(' ') || 'Cosmos denom')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosDenom}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/denom/[denom=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					denom: selection.entitySelector.denom,
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
		<ResourceBoundary resource={cosmosDenom}>
			{#snippet children(entity)}
				{[(entity.symbol ?? ''), (entity.display ?? ''), selection.entitySelector.denom].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.denom || [(prefetched.symbol ?? ''), (prefetched.display ?? ''), selection.entitySelector.denom].filter(Boolean).join(' ') || titleFallback}
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
				<dt>Denom</dt>
				<dd>
					{selection.entitySelector.denom}
				</dd>
			</div>

			<ResourceBoundary
				resource={cosmosDenom}
			>
				{#snippet children(entity)}
					{@const display = entity.display}
					{#if display != null}
						<div>
							<dt>Display</dt>
							<dd>
								{display}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							base: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const base = entity.base}
					{#if base != null}
						<div>
							<dt>Base</dt>
							<dd>
								{base}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cosmosDenom}
			>
				{#snippet children(entity)}
					{@const symbol = entity.symbol}
					{#if symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{symbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
</EntityView>
