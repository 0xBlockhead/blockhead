<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.EvmContractSourceBundle>, 'prefetched'> = $props()

	const contract = $derived(selection.entitySelector.$contract)
	const evmContractSourceBundle = $derived(selection({
		fields: {
			files: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractSourceBundle}
	entitySelector={selection.entitySelector}
	title={title ?? 'EVM contract source bundle'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/source-bundle',
				{
					network: (
						'caip2' in contract.$network ?
							caip2StringFromValue(contract.$network.caip2)
						:
							contract.$network.slug
					),
					address: contract.address,
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
		<EvmContractView
			selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<EvmContractView
			selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Contract</dt>
				<dd>
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={evmContractSourceBundle}
		>
			{#snippet children(entity)}
				{@const files = entity.files}
				{#if files !== ''}
					<code>{files}</code>
				{:else}
					<p data-text="muted">No verified source files available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary
			resource={evmContractSourceBundle}
		>
			{#snippet children(entity)}
				{@const artifactContent = entity.files}
				{#if artifactContent != null && artifactContent !== ''}
					<a
						href={`data:application/json;charset=utf-8,${encodeURIComponent(artifactContent)}`}
						download='verified-source-bundle.json'
					>
						Download verified source bundle
					</a>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
