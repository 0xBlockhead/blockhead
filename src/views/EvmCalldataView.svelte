<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmCalldata>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmCalldata>>
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

	const evmCalldata = $derived(selection({}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).hex) ?? '')].filter(Boolean).join(' ') || 'EVM calldata')
	const viewDomId = $derived('evm-calldata-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCalldata}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (({ ...selection.entitySelector, ...prefetched })?.hex != null ? resolve('/(explore)/(evm)/evm/(calldata)/calldata') : ({ ...selection.entitySelector, ...prefetched })?.hex != null ? resolve('/(explore)/(evm)/evm/(calldata)/calldata/[hex]', {
			hex: String(({ ...selection.entitySelector, ...prefetched }).hex),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const hex0 = ({ ...selection.entitySelector, ...prefetched }).hex}
			{#if hex0 !== undefined && hex0 !== null}
				<TruncatedValue value={String(hex0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={evmCalldata}>
				{#snippet Pending()}
					{@const hex0 = ({ ...selection.entitySelector, ...prefetched }).hex}
					{#if hex0 !== undefined && hex0 !== null}
						<TruncatedValue value={String(hex0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const hex0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).hex}
					{#if hex0 !== undefined && hex0 !== null}
						<TruncatedValue value={String(hex0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{selection.entitySelector.hex}
		</span>
	{/snippet}
</EntityView>
