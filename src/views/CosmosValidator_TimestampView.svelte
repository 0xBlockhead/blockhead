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
	}: Omit<EntitySelectionViewProps<EntityType.CosmosValidator_Timestamp>, 'prefetched'> = $props()

	const validator = $derived(selection.entitySelector.$validator)
	const cosmosValidatorTimestamp = $derived(selection({
		fields: {
			status: true,
			tokens: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.source || 'Cosmos validator timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CosmosValidatorView from '$/views/CosmosValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosValidator_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]/(selection)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						validator.$network.caip2 !== undefined ?
							caip2StringFromValue(validator.$network.caip2)
						:
							validator.$network.slug
					),
					validatorId: validator.operatorAddress,
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
		<ResourceBoundary resource={cosmosValidatorTimestamp}>
			{#snippet children(entity)}
				{[(entity.status ?? ''), String(entity.tokens ?? '')].filter(Boolean).join(' ') || selection.entitySelector.source || titleFallback}
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
				resource={
					selection({
						fields: {
							jailed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const jailed = entity.jailed}
					{#if jailed != null}
						<div>
							<dt>Jailed</dt>
							<dd>
								{jailed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cosmosValidatorTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={cosmosValidatorTimestamp}
			>
				{#snippet children(entity)}
					{@const tokens = entity.tokens}
					{#if tokens != null}
						<div>
							<dt>Tokens</dt>
							<dd>
								{tokens}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatorShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegatorShares = entity.delegatorShares}
					{#if delegatorShares != null}
						<div>
							<dt>Delegator shares</dt>
							<dd>
								{delegatorShares}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							commissionRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const commissionRate = entity.commissionRate}
					{#if commissionRate != null}
						<div>
							<dt>Commission rate</dt>
							<dd>
								{commissionRate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minSelfDelegation: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const minSelfDelegation = entity.minSelfDelegation}
					{#if minSelfDelegation != null}
						<div>
							<dt>Minimum self delegation</dt>
							<dd>
								{minSelfDelegation}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Validator</dt>
				<dd>
					<CosmosValidatorView
						selection={select(EntityType.CosmosValidator, selection.entitySelector.$validator)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
