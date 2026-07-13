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
			selection: EntityProxyResource<typeof schema, EntityType.TezosEntrypoint>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosEntrypoint>>
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
	const tezosEntrypoint = $derived(selection({}))
	const titleFallback = $derived('tezos entrypoint')
	const viewDomId = $derived('tezos-entrypoint-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TezosContractView from '$/views/TezosContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosEntrypoint}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosEntrypoint}>
			{#snippet Pending()}
				{title || 'tezos entrypoint'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>contract</dt>
				<dd>
					<TezosContractView
						selection={select(EntityType.TezosContract, selection.entitySelector.$contract, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>entrypoint name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									entrypointName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const entrypointName = pendingEntity.entrypointName}
							{#if entrypointName !== undefined && entrypointName !== null}
								{String((entrypointName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const entrypointName = resolvedEntity.entrypointName}
							{#if entrypointName !== undefined && entrypointName !== null}
								{String((entrypointName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>annotations</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									annotations: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const annotations = pendingEntity.annotations}
							{#if annotations !== undefined && annotations !== null}
								{annotations.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const annotations = resolvedEntity.annotations}
							{#if annotations !== undefined && annotations !== null}
								{annotations.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
