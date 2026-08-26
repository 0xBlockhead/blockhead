<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.FilecoinMessageEvent> = $props()

	const message = $derived(selection.entitySelector.$message)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Filfox_Rest,
		],
	}))
	const filecoinMessageEvent = $derived(viewSelection({
		fields: {
			name: true,
			address: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), (prefetched.address ?? '')].filter(Boolean).join(' ') || 'filecoin message event')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinMessageView from '$/views/FilecoinMessageView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMessageEvent}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/event/[index=nonNegativeInteger]',
				{
					network: (
						'caip2' in message.$network ?
							caip2StringFromValue(message.$network.caip2)
						:
							message.$network.slug
					),
					cid: message.cid,
					index: String(selection.entitySelector.index),
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
		<ResourceBoundary resource={filecoinMessageEvent}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), entity.address].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.index}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<FilecoinMessageView
				selection={select(EntityType.FilecoinMessage, selection.entitySelector.$message)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Message</dt>
				<dd>
					<FilecoinMessageView
						selection={select(EntityType.FilecoinMessage, selection.entitySelector.$message)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.index}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={filecoinMessageEvent}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.address} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={filecoinMessageEvent}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							logIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const logIndex = entity.logIndex}
					{#if logIndex != null}
						<div>
							<dt>Log index</dt>
							<dd>
								<NumberValue
									value={logIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							removed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const removed = entity.removed}
					{#if removed != null}
						<div>
							<dt>Removed</dt>
							<dd>
								{removed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Data</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									data: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.data}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Topics</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									topics: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.topics.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
