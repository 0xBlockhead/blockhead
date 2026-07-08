<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.HederaContractLog>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaContractLog>>
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
	const hederaContractLog = $derived(selection({}))
	const titleFallback = $derived('hedera contract log')
	const viewDomId = $derived('hedera-contract-log-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaContractResultView from '$/views/HederaContractResultView.svelte'
	import HederaContractView from '$/views/HederaContractView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContractLog}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaContractLog}>
			{#snippet Pending()}
				{title || 'hedera contract log'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$result}
			>
				{#snippet children(hederaContractResult)}
					{#if hederaContractResult != null && hederaContractResult[EntityMetaKey.Selector] != null}
						<div>
							<dt>result</dt>
							<dd>
								<HederaContractResultView
									selection={select(EntityType.HederaContractResult, hederaContractResult[EntityMetaKey.Selector])}
									prefetched={hederaContractResult}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet children(hederaContract)}
					{#if hederaContract != null && hederaContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>contract</dt>
							<dd>
								<HederaContractView
									selection={select(EntityType.HederaContract, hederaContract[EntityMetaKey.Selector])}
									prefetched={hederaContract}
									layout={EntityLayout.Value}
									open={false}
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
							consensusTimestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const consensusTimestamp = prefetched.consensusTimestamp}
					{#if consensusTimestamp !== undefined && consensusTimestamp !== null}
						<div>
							<dt>consensus timestamp</dt>
							<dd>
								{String((consensusTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consensusTimestamp = resolvedEntity.consensusTimestamp}
					{#if consensusTimestamp !== undefined && consensusTimestamp !== null}
						<div>
							<dt>consensus timestamp</dt>
							<dd>
								{String((consensusTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>log index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									logIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const logIndex = selection.entitySelector.logIndex ?? prefetched.logIndex}
							{#if logIndex !== undefined && logIndex !== null}
								{String((logIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const logIndex = resolvedEntity.logIndex}
							{#if logIndex !== undefined && logIndex !== null}
								{String((logIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							address: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const address = prefetched.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address = resolvedEntity.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bloom: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bloom = prefetched.bloom}
					{#if bloom !== undefined && bloom !== null}
						<div>
							<dt>bloom</dt>
							<dd>
								{String((bloom) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bloom = resolvedEntity.bloom}
					{#if bloom !== undefined && bloom !== null}
						<div>
							<dt>bloom</dt>
							<dd>
								{String((bloom) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const data = prefetched.data}
					{#if data !== undefined && data !== null}
						<div>
							<dt>data</dt>
							<dd>
								{String((data) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const data = resolvedEntity.data}
					{#if data !== undefined && data !== null}
						<div>
							<dt>data</dt>
							<dd>
								{String((data) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>topics</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									topics: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const topics = prefetched.topics}
							{#if topics !== undefined && topics !== null}
								{topics.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const topics = resolvedEntity.topics}
							{#if topics !== undefined && topics !== null}
								{topics.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
