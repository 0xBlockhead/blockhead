<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TezosContract_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosContractView from '$/views/TezosContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosContract_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'tezos contract timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		tezos contract timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>contract</dt>
				<dd>
					<TezosContractView
						selection={select(EntityType.TezosContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
						open={false}
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
							balanceMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balanceMutez = entity.balanceMutez}
					{#if balanceMutez != null}
						<div>
							<dt>balance mutez</dt>
							<dd>
								{balanceMutez}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storageHash = entity.storageHash}
					{#if storageHash != null}
						<div>
							<dt>storage hash</dt>
							<dd>
								<TruncatedValue value={storageHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegate = entity.delegate}
					{#if delegate != null}
						<div>
							<dt>delegate</dt>
							<dd>
								{delegate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
