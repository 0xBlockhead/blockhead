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
	}: EntitySelectionViewProps<EntityType.AvalancheSubnet_Timestamp> = $props()

	const avalancheSubnetTimestamp = $derived(selection({
		fields: {
			validatorCount: true,
			delegatorCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AvalancheSubnetView from '$/views/AvalancheSubnetView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalancheSubnet_Timestamp}
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
		<ResourceBoundary resource={avalancheSubnetTimestamp}>
			{#snippet children(entity)}
				{[String(entity.validatorCount ?? ''), String(entity.delegatorCount ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
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
				<dt>subnet</dt>
				<dd>
					<AvalancheSubnetView
						selection={select(EntityType.AvalancheSubnet, selection.entitySelector.$subnet)}
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
				resource={avalancheSubnetTimestamp}
			>
				{#snippet children(entity)}
					{@const validatorCount = entity.validatorCount}
					{#if validatorCount != null}
						<div>
							<dt>validator count</dt>
							<dd>
								<NumberValue
									value={validatorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={avalancheSubnetTimestamp}
			>
				{#snippet children(entity)}
					{@const delegatorCount = entity.delegatorCount}
					{#if delegatorCount != null}
						<div>
							<dt>delegator count</dt>
							<dd>
								<NumberValue
									value={delegatorCount}
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
							totalStakeNavax: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalStakeNavax = entity.totalStakeNavax}
					{#if totalStakeNavax != null}
						<div>
							<dt>total stake navax</dt>
							<dd>
								<NumberValue
									value={totalStakeNavax}
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
							chainCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const chainCount = entity.chainCount}
					{#if chainCount != null}
						<div>
							<dt>chain count</dt>
							<dd>
								<NumberValue
									value={chainCount}
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
							pendingValidatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pendingValidatorCount = entity.pendingValidatorCount}
					{#if pendingValidatorCount != null}
						<div>
							<dt>pending validator count</dt>
							<dd>
								<NumberValue
									value={pendingValidatorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
