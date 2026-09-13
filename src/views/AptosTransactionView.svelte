<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: EntitySelectionViewProps<EntityType.AptosTransaction> = $props()

	const aptosTransaction = $derived(selection({
		fields: {
			hash: true,
			transactionKind: true,
			version: true,
			sender: true,
		},
	}))
	const titleFallback = $derived((prefetched.hash ?? '') || String(prefetched.version ?? '') || 'aptos transaction')
	const viewDomId = $derived('aptos-transaction-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
	import AptosStateChangesView from '$/views/AptosStateChangesView.svelte'
	import AptosEventsView from '$/views/AptosEventsView.svelte'
	import AptosTransaction_TimestampsView from '$/views/AptosTransaction_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosTransaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				selection.entitySelector.version !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/version/[version=nonNegativeBigInt]',
						{
							network: (
								selection.entitySelector.$network.$network.caip2 !== undefined ?
									caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
								:
									selection.entitySelector.$network.$network.slug
							),
							version: String(selection.entitySelector.version),
						}
					)
				:
					selection.entitySelector.hash !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
							{
								network: (
									selection.entitySelector.$network.$network.caip2 !== undefined ?
										caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
									:
										selection.entitySelector.$network.$network.slug
								),
								transactionId: selection.entitySelector.hash,
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
	{#snippet Title()}
		<ResourceBoundary resource={aptosTransaction}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.hash} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosTransaction}>
			{#snippet children(entity)}
				{(entity.transactionKind ?? '') || entity.hash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aptosTransaction}>
			{#snippet children(entity)}
				{@const sender = entity.sender}
				{#if sender != null}
					<span data-text="muted">
						{sender}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>version</dt>
				<dd>
					<ResourceBoundary
						resource={aptosTransaction}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.version}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={aptosTransaction}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.hash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={aptosTransaction}
			>
				{#snippet children(entity)}
					{@const transactionKind = entity.transactionKind}
					{#if transactionKind != null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{transactionKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aptosTransaction}
			>
				{#snippet children(entity)}
					{@const sender = entity.sender}
					{#if sender != null}
						<div>
							<dt>sender</dt>
							<dd>
								{sender}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-aptos-tx-effects'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'aptos-tx-state-changes',
						label: 'State changes',
					},
					{
						id: 'aptos-tx-events',
						label: 'Events',
					},
				]
			}
			data-card
			class='network-view-collapsible-effects'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Effects</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAptosTxStateChanges({ id, label })}
				<AptosStateChangesView
					selection={selection.$$stateChanges}
					collapsible={false}
					title={label}
					emptyText='No state changes found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAptosTxEvents({ id, label })}
				<AptosEventsView
					selection={selection.$$events}
					collapsible={false}
					title={label}
					emptyText='No events found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-aptos-tx-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'aptos-tx-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAptosTxTimestamps({ id, label })}
				<AptosTransaction_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
