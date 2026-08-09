<!-- Generated from APP.ts. -->

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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TezosBaker_Timestamp>, 'prefetched'> = $props()

	const baker = $derived(selection.entitySelector.$baker)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TezosBakerView from '$/views/TezosBakerView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBaker_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baker/[address=stringSegment]/(tezosBaker)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						'caip2' in baker.$network.$network ?
							caip2StringFromValue(baker.$network.$network.caip2)
						:
							baker.$network.$network.slug
					),
					address: baker.address,
					level: String(selection.entitySelector.level),
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
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>baker</dt>
				<dd>
					<TezosBakerView
						selection={select(EntityType.TezosBaker, selection.entitySelector.$baker)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>level</dt>
				<dd>
					{selection.entitySelector.level}
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const consensusKey = entity.consensusKey}
					{#if consensusKey != null}
						<div>
							<dt>consensus key</dt>
							<dd>
								{consensusKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakingBalanceMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakingBalanceMutez = entity.stakingBalanceMutez}
					{#if stakingBalanceMutez != null}
						<div>
							<dt>staking balance mutez</dt>
							<dd>
								{stakingBalanceMutez}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatedBalanceMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegatedBalanceMutez = entity.delegatedBalanceMutez}
					{#if delegatedBalanceMutez != null}
						<div>
							<dt>delegated balance mutez</dt>
							<dd>
								{delegatedBalanceMutez}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ownDelegatedBalanceMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ownDelegatedBalanceMutez = entity.ownDelegatedBalanceMutez}
					{#if ownDelegatedBalanceMutez != null}
						<div>
							<dt>own delegated balance mutez</dt>
							<dd>
								{ownDelegatedBalanceMutez}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							votingPower: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const votingPower = entity.votingPower}
					{#if votingPower != null}
						<div>
							<dt>voting power</dt>
							<dd>
								{votingPower}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const active = entity.active}
					{#if active != null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
