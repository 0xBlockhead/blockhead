<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.AvalancheValidator_Timestamp> = $props()

	const avalancheValidatorTimestamp = $derived(selection({
		fields: {
			connected: true,
			uptimePercent: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AvalancheValidatorView from '$/views/AvalancheValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalancheValidator_Timestamp}
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
		<ResourceBoundary resource={avalancheValidatorTimestamp}>
			{#snippet children(entity)}
				{[String(entity.connected ?? ''), String(entity.uptimePercent ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>validator</dt>
				<dd>
					<AvalancheValidatorView
						selection={select(EntityType.AvalancheValidator, selection.entitySelector.$validator)}
						layout={EntityLayout.Value}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={avalancheValidatorTimestamp}
			>
				{#snippet children(entity)}
					{@const connected = entity.connected}
					{#if connected != null}
						<div>
							<dt>connected</dt>
							<dd>
								{connected ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={avalancheValidatorTimestamp}
			>
				{#snippet children(entity)}
					{@const uptimePercent = entity.uptimePercent}
					{#if uptimePercent != null}
						<div>
							<dt>uptime percent</dt>
							<dd>
								<NumberValue
									value={uptimePercent}
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
							validatorSetKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validatorSetKind = entity.validatorSetKind}
					{#if validatorSetKind != null}
						<div>
							<dt>validator set kind</dt>
							<dd>
								{validatorSetKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedStakeNavax: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedStakeNavax = entity.observedStakeNavax}
					{#if observedStakeNavax != null}
						<div>
							<dt>observed stake navax</dt>
							<dd>
								<NumberValue
									value={observedStakeNavax}
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
							observedDelegatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedDelegatorCount = entity.observedDelegatorCount}
					{#if observedDelegatorCount != null}
						<div>
							<dt>observed delegator count</dt>
							<dd>
								<NumberValue
									value={observedDelegatorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
