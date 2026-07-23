<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.EvmContractSourceBundle>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EvmContractSourceBundle>
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
	const evmContractSourceBundle = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'EVM contract source bundle'
	const viewDomId = $derived('evm-contract-source-bundle-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractSourceBundle}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmContractSourceBundle}>
			{#snippet children(entity)}
				<EvmContractView
					selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmContractSourceBundle}>
			{#snippet children(entity)}
				<EvmContractView
					selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Contract</dt>
				<dd>
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							(
								selection.entitySelector.$contract != null && 'address' in selection.entitySelector.$contract
								&& selection.entitySelector.$contract.address != null
								&& selection.entitySelector.$contract != null && '$network' in selection.entitySelector.$contract ?
									selection.entitySelector.$contract.$network != null && 'caip2' in selection.entitySelector.$contract.$network
									&& selection.entitySelector.$contract.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
									address: String(selection.entitySelector.$contract.address ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$contract.$network != null && 'slug' in selection.entitySelector.$contract.$network
										&& selection.entitySelector.$contract.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
										address: String(selection.entitySelector.$contract.address ?? ''),
										network: String(selection.entitySelector.$contract.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
