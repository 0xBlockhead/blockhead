<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MorphoVaultPosition>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Morpho_Graphql,
		],
	}))
	const morphoVaultPosition = $derived(viewSelection({
		fields: {
			assets: true,
			shares: true,
		},
	}))
	const titleFallback = 'Morpho vault position'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import MorphoVaultView from '$/views/MorphoVaultView.svelte'
</script>


<EntityView
	entityType={EntityType.MorphoVaultPosition}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<MorphoVaultView
			selection={select(EntityType.MorphoVault, selection.entitySelector.$vault)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={morphoVaultPosition}>
			{#snippet children(entity)}
				{[entity.assets, entity.shares].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Vault</dt>
				<dd>
					<MorphoVaultView
						selection={select(EntityType.MorphoVault, selection.entitySelector.$vault)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Assets</dt>
				<dd>
					<ResourceBoundary
						resource={morphoVaultPosition}
					>
						{#snippet children(entity)}
							{entity.assets}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Shares</dt>
				<dd>
					<ResourceBoundary
						resource={morphoVaultPosition}
					>
						{#snippet children(entity)}
							{entity.shares}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							assetsUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetsUsd = entity.assetsUsd}
					{#if assetsUsd != null}
						<div>
							<dt>Assets (USD)</dt>
							<dd>
								{assetsUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
