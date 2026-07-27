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
	}: EntitySelectionViewProps<EntityType.TonAccount_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const tonAccountTimestamp = $derived(selection({
		fields: {
			balanceNano: true,
			status: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.balanceNano ?? '') || 'TON account timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.TonAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonAccountTimestamp}>
			{#snippet children(entity)}
				{@const balanceNano0 = entity.balanceNano}
				{#if balanceNano0 != null}
					<NumberValue
						value={balanceNano0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={tonAccountTimestamp}>
			{#snippet children(entity)}
				{@const status0 = entity.status}
				{#if status0 != null}
					<span data-text="muted">
						{status0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={tonAccountTimestamp}
			>
				{#snippet children(entity)}
					{@const balanceNano = entity.balanceNano}
					{#if balanceNano != null}
						<div>
							<dt>balance nano</dt>
							<dd>
								<NumberValue
									value={balanceNano}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={tonAccountTimestamp}
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
				resource={
					selection({
						fields: {
							lastActivityTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastActivityTimestampMs = entity.lastActivityTimestampMs}
					{#if lastActivityTimestampMs != null}
						<div>
							<dt>last activity</dt>
							<dd>
								<Timestamp timestamp={Number(lastActivityTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<div>
				<dt>account</dt>
				<dd>
					<TonAccountView
						selection={select(EntityType.TonAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
