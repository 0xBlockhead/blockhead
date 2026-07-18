<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EvmSelector>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmSelector>>
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
	const evmSelector = $derived(selection({
		sources: selection.sources,
		fields: {
			signatures: true,
		},
	}))
	const titleFallback = $derived('EVM selector')
	const viewDomId = $derived('evm-selector-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmSelector_TimestampsView from '$/views/EvmSelector_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmSelector}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.hex !== undefined ? resolve('/evm/selector/[hex=zeroExHex]', {
			hex: String(pendingEntity.hex ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={evmSelector}
			placeholderText="Loading decoded function selector..."
		>
			{#snippet Pending()}
				{selection.entitySelector.hex}
			{/snippet}

			{#snippet children(entity)}
				{entity.signatures.values[0] ?? selection.entitySelector.hex}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{selection.entitySelector.hex}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Selector</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									hex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hex = resolvedEntity.hex}
							{#if hex !== undefined && hex !== null}
								<TruncatedValue value={String((hex) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								signatures: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						<div>
							<dt>Signatures</dt>
							<dd>
								{#if entity.signatures.values.length}
									<ul>
										{#each entity.signatures.values as signature (signature)}
											<li><code>{signature}</code></li>
										{/each}
									</ul>
								{:else}
									<p data-text="muted">No catalog signatures matched this function selector.</p>
								{/if}
							</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EvmSelector_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Observations'
				emptyText='No Openchain observations for this selector.'
				id='EvmSelector_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
