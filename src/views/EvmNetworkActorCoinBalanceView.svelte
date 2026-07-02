<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkActorCoinBalance>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmNetworkActorCoinBalance>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const evmNetworkActorCoinBalance = $derived(selection({
		sources: [
			Source.Allium_Rest,
		],
		fields: {
			$coinInstance: true,
			symbol: true,
			decimals: true,
			...(open && {
				$$timestamps: true,
				$$blocks: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? '')].filter(Boolean).join(' ') || 'balance')
	const viewDomId = $derived('evm-network-actor-coin-balance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkActorCoinBalance}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? '')].filter(Boolean).join(' ') || title || 'balance'}
		{:else}
			<ResourceBoundary resource={evmNetworkActorCoinBalance}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? '')].filter(Boolean).join(' ') || title || 'balance'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.symbol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<EvmAccountView
				selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
				href={
						resolve('/(explore)/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$actor.address),
						})
					}
				layout={EntityLayout.Value}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={evmNetworkActorCoinBalance}>
				{#snippet Pending()}
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
						href={
							resolve('/(explore)/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$actor.address),
							})
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
						href={
							resolve('/(explore)/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$actor.address),
							})
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Contract</dt>
				<dd>
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace)}:${String(selection.entitySelector.$contract.$network.caip2.reference)}`,
								address: String(selection.entitySelector.$contract.address),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Decimals</dt>
				<dd>
					<ResourceBoundary resource={evmNetworkActorCoinBalance}>
						{#snippet Pending()}
							{@const decimals = prefetched.decimals ?? selection.entitySelector.decimals}
							{#if decimals !== undefined && decimals !== null}
								<NumberValue value={Number(decimals)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const decimals = entity.decimals ?? selection.entitySelector.decimals ?? prefetched.decimals}
							{#if decimals !== undefined && decimals !== null}
								<NumberValue value={Number(decimals)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
