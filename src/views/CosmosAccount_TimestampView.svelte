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
	}: Omit<EntitySelectionViewProps<EntityType.CosmosAccount_Timestamp>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)
	const cosmosAccountTimestamp = $derived(selection({
		fields: {
			accountNumber: true,
			sequence: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.source || 'Cosmos account timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in account.$network ?
							caip2StringFromValue(account.$network.caip2)
						:
							account.$network.slug
					),
					accountId: account.address,
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
	{#snippet Value()}
		<ResourceBoundary resource={cosmosAccountTimestamp}>
			{#snippet children(entity)}
				{[String(entity.accountNumber ?? ''), String(entity.sequence ?? '')].filter(Boolean).join(' ') || selection.entitySelector.source || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
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
				resource={cosmosAccountTimestamp}
			>
				{#snippet children(entity)}
					{@const accountNumber = entity.accountNumber}
					{#if accountNumber != null}
						<div>
							<dt>Account number</dt>
							<dd>
								{accountNumber}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cosmosAccountTimestamp}
			>
				{#snippet children(entity)}
					{@const sequence = entity.sequence}
					{#if sequence != null}
						<div>
							<dt>Sequence</dt>
							<dd>
								{sequence}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Account</dt>
				<dd>
					<CosmosAccountView
						selection={select(EntityType.CosmosAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
