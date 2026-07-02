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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconValidator>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BeaconValidator>>
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

	const beaconValidator = $derived(selection({
		sources: [
			Source.Beacon_Rest,
		],
		fields: {
			status: true,
			...(open && {
				balanceGwei: true,
				effectiveBalanceGwei: true,
				slashed: true,
				pubkey: true,
			}),
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInNetwork) ?? '') ? 'Validator #' + String((({ ...selection.entitySelector, ...prefetched }).indexInNetwork) ?? '') : '') || 'beacon validator')
	const viewDomId = $derived('beacon-validator-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconValidator}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInNetwork ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/validator/[validatorIndex=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).caip2.reference)}`,
			validatorIndex: String(({ ...selection.entitySelector, ...prefetched }).indexInNetwork),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInNetwork}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Validator </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInNetwork}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const status0 = prefetched.status}
			{#if status0 !== undefined && status0 !== null}
				<span data-text="muted">
					{String((status0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={beaconValidator}>
				{#snippet Pending()}
					{@const status0 = prefetched.status}
					{#if status0 !== undefined && status0 !== null}
						<span data-text="muted">
							{String((status0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const status0 = entity.status}
					{#if status0 !== undefined && status0 !== null}
						<span data-text="muted">
							{String((status0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in network</dt>
				<dd>
					<ResourceBoundary resource={beaconValidator}>
						{#snippet Pending()}
							{@const indexInNetwork = prefetched.indexInNetwork ?? selection.entitySelector.indexInNetwork}
							{#if indexInNetwork !== undefined && indexInNetwork !== null}
								<NumberValue value={Number(indexInNetwork)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const indexInNetwork = entity.indexInNetwork ?? selection.entitySelector.indexInNetwork ?? prefetched.indexInNetwork}
							{#if indexInNetwork !== undefined && indexInNetwork !== null}
								<NumberValue value={Number(indexInNetwork)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={beaconValidator}>
				{#snippet Pending()}
					{@const slashed = prefetched.slashed ?? selection.entitySelector.slashed}
					{#if slashed !== undefined && slashed !== null}
						<div>
							<dt>Slashed</dt>
							<dd>
								{String((slashed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const slashed = entity.slashed ?? selection.entitySelector.slashed ?? prefetched.slashed}
					{#if slashed !== undefined && slashed !== null}
						<div>
							<dt>Slashed</dt>
							<dd>
								{String((slashed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={beaconValidator}>
				{#snippet Pending()}
					{@const balanceGwei = prefetched.balanceGwei ?? selection.entitySelector.balanceGwei}
					{#if balanceGwei !== undefined && balanceGwei !== null}
						<div>
							<dt>Balance</dt>
							<dd>
								<NumberValue value={Number(balanceGwei)} />

								<span> gwei</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const balanceGwei = entity.balanceGwei ?? selection.entitySelector.balanceGwei ?? prefetched.balanceGwei}
					{#if balanceGwei !== undefined && balanceGwei !== null}
						<div>
							<dt>Balance</dt>
							<dd>
								<NumberValue value={Number(balanceGwei)} />

								<span> gwei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={beaconValidator}>
				{#snippet Pending()}
					{@const effectiveBalanceGwei = prefetched.effectiveBalanceGwei ?? selection.entitySelector.effectiveBalanceGwei}
					{#if effectiveBalanceGwei !== undefined && effectiveBalanceGwei !== null}
						<div>
							<dt>Effective balance</dt>
							<dd>
								<NumberValue value={Number(effectiveBalanceGwei)} />

								<span> gwei</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const effectiveBalanceGwei = entity.effectiveBalanceGwei ?? selection.entitySelector.effectiveBalanceGwei ?? prefetched.effectiveBalanceGwei}
					{#if effectiveBalanceGwei !== undefined && effectiveBalanceGwei !== null}
						<div>
							<dt>Effective balance</dt>
							<dd>
								<NumberValue value={Number(effectiveBalanceGwei)} />

								<span> gwei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={beaconValidator}>
				{#snippet Pending()}
					{@const pubkey = prefetched.pubkey ?? selection.entitySelector.pubkey}
					{#if pubkey !== undefined && pubkey !== null}
						<div>
							<dt>Public key</dt>
							<dd>
								<TruncatedValue value={String(pubkey)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const pubkey = entity.pubkey ?? selection.entitySelector.pubkey ?? prefetched.pubkey}
					{#if pubkey !== undefined && pubkey !== null}
						<div>
							<dt>Public key</dt>
							<dd>
								<TruncatedValue value={String(pubkey)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
		</dl>
	{/snippet}
</EntityView>
