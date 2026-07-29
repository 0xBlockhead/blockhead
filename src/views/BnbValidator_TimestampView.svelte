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
	}: EntitySelectionViewProps<EntityType.BnbValidator_Timestamp> = $props()

	const bnbValidatorTimestamp = $derived(selection({
		fields: {
			status: true,
			jailed: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BnbValidatorView from '$/views/BnbValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbValidator_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbValidatorTimestamp}>
			{#snippet children(entity)}
				{[(entity.status ?? ''), String(entity.jailed ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>validator</dt>
				<dd>
					<BnbValidatorView
						selection={select(EntityType.BnbValidator, selection.entitySelector.$validator)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

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
				resource={bnbValidatorTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bnbValidatorTimestamp}
			>
				{#snippet children(entity)}
					{@const jailed = entity.jailed}
					{#if jailed != null}
						<div>
							<dt>jailed</dt>
							<dd>
								{jailed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
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
								<NumberValue
									value={votingPower}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakeAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakeAmount = entity.stakeAmount}
					{#if stakeAmount != null}
						<div>
							<dt>stake amount</dt>
							<dd>
								<NumberValue
									value={stakeAmount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
