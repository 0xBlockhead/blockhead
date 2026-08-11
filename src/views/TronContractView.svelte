<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
	}: EntitySelectionViewProps<EntityType.TronContract> = $props()

	const network = $derived(selection.entitySelector.$network)
	const tronContract = $derived(selection({
		sources: selection.sources ?? [
			Source.TronScan_Rest,
		],
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || selection.entitySelector.address || 'tron contract')
	const viewDomId = $derived('tron-contract-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TronAccountView from '$/views/TronAccountView.svelte'
	import TronTransactionView from '$/views/TronTransactionView.svelte'
	import TronTokensView from '$/views/TronTokensView.svelte'
	import TronContract_TimestampsView from '$/views/TronContract_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TronContract}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/contract/[address=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					address: selection.entitySelector.address,
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
		<ResourceBoundary resource={tronContract}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$account}
		>
			{#snippet children(tronAccount)}
				{#if tronAccount != null}
					{@const tronAccountInitial = untrack(() => tronAccount)}
					<TronAccountView
						selection={select(EntityType.TronAccount, (tronAccount ?? tronAccountInitial)[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(tronAccount)}
					{#if tronAccount != null}
						{@const tronAccountInitial = untrack(() => tronAccount)}
						<div>
							<dt>Account</dt>
							<dd>
								<TronAccountView
									selection={select(EntityType.TronAccount, (tronAccount ?? tronAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={tronContract}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$creator}
			>
				{#snippet children(tronAccount)}
					{#if tronAccount != null}
						{@const tronAccountInitial = untrack(() => tronAccount)}
						<div>
							<dt>Creator</dt>
							<dd>
								<TronAccountView
									selection={select(EntityType.TronAccount, (tronAccount ?? tronAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$creationTransaction}
			>
				{#snippet children(tronTransaction)}
					{#if tronTransaction != null}
						{@const tronTransactionInitial = untrack(() => tronTransaction)}
						<div>
							<dt>Creation transaction</dt>
							<dd>
								<TronTransactionView
									selection={select(EntityType.TronTransaction, (tronTransaction ?? tronTransactionInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-tron-contract-related'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tron-contract-tokens',
						label: 'Tokens',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Related</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTronContractTokens({ id, label })}
				<TronTokensView
					selection={selection.$$tokens}
					collapsible={false}
					title={label}
					emptyText='No tokens.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-tron-contract-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tron-contract-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTronContractTimestamps({ id, label })}
				<TronContract_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
