<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.PolkadotEvent> = $props()

	const block = $derived(selection.entitySelector.$block)
	const polkadotEvent = $derived(selection({
		fields: {
			eventName: true,
		},
	}))
	const titleFallback = $derived([(prefetched.eventName ?? ''), 'Event ' + String(selection.entitySelector.indexInBlock)].filter(Boolean).join(' ') || 'Polkadot event')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotEvent}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'hash' in block ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/event/[eventIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in block.$network ?
									caip2StringFromValue(block.$network.caip2)
								:
									block.$network.slug
							),
							blockNumber: String(block.blockNumber),
							hash: block.hash,
							eventIndex: String(selection.entitySelector.indexInBlock),
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={polkadotEvent}>
			{#snippet children(entity)}
				{[entity.eventName, 'Event ' + String(selection.entitySelector.indexInBlock)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotEvent}>
			{#snippet children(entity)}
				{entity.eventName || [entity.eventName, 'Event ' + String(selection.entitySelector.indexInBlock)].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$pallet}
		>
			{#snippet children(polkadotPallet)}
				{#if polkadotPallet != null}
					<span data-text="muted">
						<PolkadotPalletView
							selection={select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector])}
							prefetched={polkadotPallet}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in block</dt>
				<dd>
					{selection.entitySelector.indexInBlock}
				</dd>
			</div>

			<div>
				<dt>Event name</dt>
				<dd>
					<ResourceBoundary
						resource={polkadotEvent}
					>
						{#snippet children(entity)}
							{entity.eventName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$pallet}
			>
				{#snippet children(polkadotPallet)}
					{#if polkadotPallet != null}
						<div>
							<dt>Pallet</dt>
							<dd>
								<PolkadotPalletView
									selection={select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector])}
									prefetched={polkadotPallet}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$extrinsic}
			>
				{#snippet children(polkadotExtrinsic)}
					{#if polkadotExtrinsic != null}
						<div>
							<dt>Extrinsic</dt>
							<dd>
								<PolkadotExtrinsicView
									selection={select(EntityType.PolkadotExtrinsic, polkadotExtrinsic[EntityMetaKey.Selector])}
									prefetched={polkadotExtrinsic}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Block</dt>
				<dd>
					<PolkadotBlockView
						selection={select(EntityType.PolkadotBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
