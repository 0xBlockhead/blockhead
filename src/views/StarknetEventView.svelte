<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.StarknetEvent>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.StarknetEvent>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const starknetEvent = $derived(selection({
		sources: [
			Source.Starknet_JsonRpc,
			Source.Starkscan_Rest,
			Source.Voyager_Rest,
		],
	}))
	const titleFallback = $derived([String((pendingEntity.eventIndex) ?? '')].filter(Boolean).join(' ') || 'starknet event')
	const viewDomId = $derived('starknet-event-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StarknetTransactionView from '$/views/StarknetTransactionView.svelte'
	import StarknetContractView from '$/views/StarknetContractView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetEvent}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={starknetEvent}>
			{#snippet Pending()}
				{@const eventIndex0 = pendingEntity.eventIndex}
				{#if eventIndex0 !== undefined && eventIndex0 !== null}
					<NumberValue value={Number(eventIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const eventIndex0 = resolvedEntity.eventIndex}
				{#if eventIndex0 !== undefined && eventIndex0 !== null}
					<NumberValue value={Number(eventIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetEvent}>
			{#snippet Pending()}
				<StarknetTransactionView
					selection={select(EntityType.StarknetTransaction, selection.entitySelector.$transaction)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<StarknetTransactionView
					selection={select(EntityType.StarknetTransaction, selection.entitySelector.$transaction)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={starknetEvent}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$fromContract}
				>
					{#snippet children(starknetContract)}
						{#if starknetContract != null && starknetContract[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<StarknetContractView
									selection={select(EntityType.StarknetContract, starknetContract[EntityMetaKey.Selector])}
									prefetched={starknetContract}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$fromContract}
				>
					{#snippet children(starknetContract)}
						{#if starknetContract != null && starknetContract[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<StarknetContractView
									selection={select(EntityType.StarknetContract, starknetContract[EntityMetaKey.Selector])}
									prefetched={starknetContract}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<StarknetTransactionView
						selection={select(EntityType.StarknetTransaction, selection.entitySelector.$transaction, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>event index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									eventIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const eventIndex = pendingEntity.eventIndex}
							{#if eventIndex !== undefined && eventIndex !== null}
								<NumberValue value={Number(eventIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eventIndex = resolvedEntity.eventIndex}
							{#if eventIndex !== undefined && eventIndex !== null}
								<NumberValue value={Number(eventIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$fromContract}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(starknetContract)}
					{#if starknetContract != null && starknetContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>from contract</dt>
							<dd>
								<StarknetContractView
									selection={select(EntityType.StarknetContract, starknetContract[EntityMetaKey.Selector])}
									prefetched={starknetContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>keys</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									keys: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const keys = pendingEntity.keys}
							{#if keys !== undefined && keys !== null}
								{keys.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const keys = resolvedEntity.keys}
							{#if keys !== undefined && keys !== null}
								{keys.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>data</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									data: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const data = pendingEntity.data}
							{#if data !== undefined && data !== null}
								{data.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const data = resolvedEntity.data}
							{#if data !== undefined && data !== null}
								{data.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
