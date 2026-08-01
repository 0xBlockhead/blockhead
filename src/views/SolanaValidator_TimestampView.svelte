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
	}: EntitySelectionViewProps<EntityType.SolanaValidator_Timestamp> = $props()

	const solanaValidatorTimestamp = $derived(selection({
		fields: {
			delinquent: true,
			timestampMs: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SolanaValidatorView from '$/views/SolanaValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaValidator_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.slot)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.slot}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaValidatorTimestamp}>
			{#snippet children(entity)}
				{String(entity.delinquent ?? '') || String(selection.entitySelector.slot)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaValidatorTimestamp}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<span data-text="muted">
						<Timestamp timestamp={timestampMs} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Validator</dt>
				<dd>
					<SolanaValidatorView
						selection={select(EntityType.SolanaValidator, selection.entitySelector.$validator)}
						layout={EntityLayout.Value}
					/>
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
							nodePubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodePubkey = entity.nodePubkey}
					{#if nodePubkey != null}
						<div>
							<dt>Node public key</dt>
							<dd>
								{nodePubkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activatedStakeLamports: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activatedStakeLamports = entity.activatedStakeLamports}
					{#if activatedStakeLamports != null}
						<div>
							<dt>Activated stake</dt>
							<dd>
								{activatedStakeLamports}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							commission: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const commission = entity.commission}
					{#if commission != null}
						<div>
							<dt>Commission</dt>
							<dd>
								{commission}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastVoteSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastVoteSlot = entity.lastVoteSlot}
					{#if lastVoteSlot != null}
						<div>
							<dt>Last vote slot</dt>
							<dd>
								{lastVoteSlot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rootSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rootSlot = entity.rootSlot}
					{#if rootSlot != null}
						<div>
							<dt>Root slot</dt>
							<dd>
								{rootSlot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
