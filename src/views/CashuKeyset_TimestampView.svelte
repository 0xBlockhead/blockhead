<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CashuKeyset_Timestamp>, 'prefetched'> = $props()

	const keyset = $derived(selection.entitySelector.$keyset)
	const cashuKeysetTimestamp = $derived(selection({
		fields: {
			active: true,
			inputFeePpk: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CashuKeysetView from '$/views/CashuKeysetView.svelte'
</script>


<EntityView
	entityType={EntityType.CashuKeyset_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/cashu/mint/[mintUrl=stringSegment]/(cashuMint)/keyset/[keysetId=stringSegment]/(cashuKeyset)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					mintUrl: keyset.$mint.mintUrl,
					keysetId: keyset.keysetId,
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
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cashuKeysetTimestamp}>
			{#snippet children(entity)}
				{[String(entity.active ?? ''), String(entity.inputFeePpk ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>keyset</dt>
				<dd>
					<CashuKeysetView
						selection={select(EntityType.CashuKeyset, selection.entitySelector.$keyset)}
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
				resource={cashuKeysetTimestamp}
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

		<dl data-column-item="center">
			<ResourceBoundary
				resource={cashuKeysetTimestamp}
			>
				{#snippet children(entity)}
					{@const inputFeePpk = entity.inputFeePpk}
					{#if inputFeePpk != null}
						<div>
							<dt>input fee ppk</dt>
							<dd>
								<NumberValue
									value={inputFeePpk}
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
							finalExpiryMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const finalExpiryMs = entity.finalExpiryMs}
					{#if finalExpiryMs != null}
						<div>
							<dt>final expiry ms</dt>
							<dd>
								<Timestamp timestamp={finalExpiryMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							listedByKeysEndpoint: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const listedByKeysEndpoint = entity.listedByKeysEndpoint}
					{#if listedByKeysEndpoint != null}
						<div>
							<dt>listed by keys endpoint</dt>
							<dd>
								{listedByKeysEndpoint ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							listedByKeysetsEndpoint: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const listedByKeysetsEndpoint = entity.listedByKeysetsEndpoint}
					{#if listedByKeysetsEndpoint != null}
						<div>
							<dt>listed by keysets endpoint</dt>
							<dd>
								{listedByKeysetsEndpoint ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
