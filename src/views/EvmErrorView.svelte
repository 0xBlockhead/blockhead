<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EvmError>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmError>>
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

	const evmError = $derived(selection({
		sources: [
			Source.Openchain_Rest,
		],
		fields: {
			signatures: true,
			...(open && {
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived('EVM error')
	const viewDomId = $derived('evm-error-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmError_TimestampsView from '$/views/EvmError_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmError}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(evm)/evm/(errors)/error/[hex]', {
			hex: String(({ ...selection.entitySelector, ...prefetched }).hex),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={evmError}
			placeholderText="Loading decoded error selector..."
		>
			{#snippet Pending()}
				{selection.entitySelector.hex}
			{/snippet}

			{#snippet children(entity)}
				{entity.signatures?.[0] ?? selection.entitySelector.hex}
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
					<ResourceBoundary resource={evmError}>
						{#snippet Pending()}
							{@const hex = prefetched.hex ?? selection.entitySelector.hex}
							{#if hex !== undefined && hex !== null}
								<TruncatedValue value={String(hex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const hex = entity.hex ?? selection.entitySelector.hex ?? prefetched.hex}
							{#if hex !== undefined && hex !== null}
								<TruncatedValue value={String(hex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary resource={evmError}>
					{#snippet children(entity)}
						<div>
							<dt>Signatures</dt>
							<dd>
								{#if entity.signatures?.length}
									<ul>
										{#each entity.signatures as signature (signature)}
											<li><code>{signature}</code></li>
										{/each}
									</ul>
								{:else}
									<p data-text="muted">No catalog matches for this revert/error selector.</p>
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
			<EvmError_TimestampsView
				selection={selection[EntityProxyField]<EntityType.EvmError_Timestamp>('$$timestamps')}
				title='Observations'
				emptyText='No Openchain observations for this error.'
				id='EvmError_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
