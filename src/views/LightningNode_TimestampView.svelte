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
	}: EntitySelectionViewProps<EntityType.LightningNode_Timestamp> = $props()

	const lightningNodeTimestamp = $derived(selection({
		fields: {
			alias: true,
			capacitySats: true,
		},
	}))
	const titleFallback = $derived([(prefetched.alias ?? ''), String(selection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'Lightning node timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNode_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lightningNodeTimestamp}>
			{#snippet children(entity)}
				{[(entity.alias ?? ''), String(selection.entitySelector.timestampMs)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lightningNodeTimestamp}>
			{#snippet children(entity)}
				{@const capacitySats = entity.capacitySats}
				{#if capacitySats != null}
					<NumberValue
						value={capacitySats}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Node</dt>
				<dd>
					<LightningNodeView
						selection={select(EntityType.LightningNode, selection.entitySelector.$node)}
						layout={EntityLayout.Value}
						open={false}
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
							color: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const color = entity.color}
					{#if color != null}
						<div>
							<dt>Color</dt>
							<dd>
								{color}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							channelCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const channelCount = entity.channelCount}
					{#if channelCount != null}
						<div>
							<dt>Channels</dt>
							<dd>
								{channelCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							firstSeenMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const firstSeenMs = entity.firstSeenMs}
					{#if firstSeenMs != null}
						<div>
							<dt>First seen</dt>
							<dd>
								{firstSeenMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							updatedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const updatedAtMs = entity.updatedAtMs}
					{#if updatedAtMs != null}
						<div>
							<dt>Updated</dt>
							<dd>
								{updatedAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							countryCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const countryCode = entity.countryCode}
					{#if countryCode != null}
						<div>
							<dt>Country</dt>
							<dd>
								{countryCode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							city: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const city = entity.city}
					{#if city != null}
						<div>
							<dt>City</dt>
							<dd>
								{city}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									networkAddresses: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.networkAddresses.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
