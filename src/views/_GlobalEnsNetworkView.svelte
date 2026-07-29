<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType._GlobalEnsNetwork> = $props()

	const titleFallback = 'ENS'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import GlobalEnsNetwork_TimestampsView from '$/views/_GlobalEnsNetwork_TimestampsView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalEnsNetwork}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve('/(explore)/(ens)/ens')
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		ENS
	{/snippet}

	{#snippet Value()}
		{titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$registryContract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Registry name contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$ethRegistrarController}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>.eth registrar controller</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$reverseRegistrar}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Reverse registrar</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$nameWrapper}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Name wrapper</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GlobalEnsNetwork_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
