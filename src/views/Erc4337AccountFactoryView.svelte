<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4337AccountFactory>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Erc4337AccountFactory>>
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

	const erc4337AccountFactory = $derived(selection({
		fields: {
			$contract: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).address) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 account factory')
	const viewDomId = $derived('erc4337account-factory-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337AccountFactory}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/account-factory/[address=evmAddress]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).caip2.reference)}`,
			address: String(({ ...selection.entitySelector, ...prefetched }).address),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
			{#if address0 !== undefined && address0 !== null}
				<TruncatedValue value={String(address0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={erc4337AccountFactory}>
				{#snippet Pending()}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
			{#if address0 !== undefined && address0 !== null}
				<TruncatedValue value={String(address0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={erc4337AccountFactory}>
				{#snippet Pending()}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
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
			</span>
		{:else}
			<ResourceBoundary resource={erc4337AccountFactory}>
				{#snippet Pending()}
					<span data-text="muted">
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
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
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
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Contract</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$contract')}
					>
						{#snippet children(evmContract)}
							<EvmContractView
								selection={select(EntityType.EvmContract, evmContract.entitySelector)}
								prefetched={evmContract}
								href={
									resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
										caip2: `${String(evmContract.entitySelector.$network.caip2.namespace)}:${String(evmContract.entitySelector.$network.caip2.reference)}`,
										address: String(evmContract.entitySelector.address),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
