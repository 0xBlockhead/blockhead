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
	}: EntitySelectionViewProps<EntityType.LogosBlockchainNetwork_Timestamp> = $props()

	const logosBlockchainNetworkTimestamp = $derived(selection({
		fields: {
			height: true,
			mode: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LogosBlockchainNetworkView from '$/views/LogosBlockchainNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.LogosBlockchainNetwork_Timestamp}
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
		<ResourceBoundary resource={logosBlockchainNetworkTimestamp}>
			{#snippet children(entity)}
				{@const height = entity.height}
				{#if height != null}
					<NumberValue
						value={height}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={logosBlockchainNetworkTimestamp}>
			{#snippet children(entity)}
				{@const mode = entity.mode}
				{#if mode != null}
					<span data-text="muted">
						{mode}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<LogosBlockchainNetworkView
						selection={select(EntityType.LogosBlockchainNetwork, selection.entitySelector.$network)}
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

			<ResourceBoundary
				resource={logosBlockchainNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const mode = entity.mode}
					{#if mode != null}
						<div>
							<dt>Mode</dt>
							<dd>
								{mode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={logosBlockchainNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const height = entity.height}
					{#if height != null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue
									value={height}
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
							slot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slot = entity.slot}
					{#if slot != null}
						<div>
							<dt>Slot</dt>
							<dd>
								<NumberValue
									value={slot}
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
							libSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const libSlot = entity.libSlot}
					{#if libSlot != null}
						<div>
							<dt>LIB slot</dt>
							<dd>
								<NumberValue
									value={libSlot}
								/>
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
							tip: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tip = entity.tip}
					{#if tip != null}
						<div>
							<dt>Tip</dt>
							<dd>
								{tip}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lib: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lib = entity.lib}
					{#if lib != null}
						<div>
							<dt>LIB</dt>
							<dd>
								{lib}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
