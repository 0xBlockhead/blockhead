<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(contracts)/contract/[address]/source-bundle/[bundleId]',
			{
				...caip2RouteParamsFromEvmChainId(entityId.$network.chainId),
				address: entityId.$contract.address,
				bundleId: entityId.bundleId,
			},
		),
		layout = EntityLayout.SummaryDetails,
		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
			|| layout === EntityLayout.Details
		),
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmContractSourceBundle>
			href?: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const sourceBundle = useEntity(
		EntityType.EvmContractSourceBundle,
		entityId,
		{
			$: [
				Source.Sourcify_Rest,
			],
			...(open && {
				files: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractSourceBundle}
	{entityId}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		Verified source files
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={sourceBundle}
			placeholderText="Loading source bundle…"
		>
			{#snippet children(sourceBundle)}
				{Object.keys(sourceBundle.files ?? {}).length} file{(
					Object.keys(sourceBundle.files ?? {}).length === 1 ?
						''
					:
						's'
				)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Published source text from a verification provider (Sourcify), keyed by path.
		</p>
		<p>
			Any high-level language (Solidity, Vyper, Yul, …) compiles to the same on-chain bytecode; this bundle is the human-readable artifact that matched.
		</p>
	{/snippet}

	{#snippet Content({
		open: contentOpen,
	})}
		{#if contentOpen}
			<dl data-column-item="center">
				<div>
					<dt>Source files</dt>
					<dd>
						<ResourceBoundary
							resource={sourceBundle}
							placeholderText="Loading source files…"
						>
							{#snippet children(sourceBundle)}
								{#if Object.keys(sourceBundle.files ?? {}).length > 0}
									<div data-column="gap-2">
										{#each Object.entries(sourceBundle.files ?? {}) as [path, content] (path)}
											<details>
												<summary><code>{path}</code></summary>
												<pre data-text="font-monospace">{content}</pre>
											</details>
										{/each}
									</div>
								{:else}
									<p data-text="muted">No source files in this bundle.</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			</dl>
		{/if}
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
	{/snippet}
</EntityView>
