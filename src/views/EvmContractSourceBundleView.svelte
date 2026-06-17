<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address]', {
			caip2: ,
			address: selector.$contract.address,
		}),
		layout = EntityLayout.SummaryDetails,
		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
		),
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmContractSourceBundle>
			href?: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	
	const files = $derived(proxy(EntityType.EvmContractSourceBundle, selector, {
		sources: [Source.Sourcify_Rest],
	}).files)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractSourceBundle}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={files}
			placeholderText="Loading source bundle…"
		>
			{#snippet children(files)}
				{#if Object.keys(files ?? {}).length > 0}
					<code>
						{String(Object.keys(files ?? {})[0])
							.split('/')
							.at(-1)}
					</code>
				{:else}
					Verified source files
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={files}
			placeholderText="Loading source bundle…"
		>
			{#snippet children(files)}
				{Object.keys(files ?? {}).length} file{
					Object.keys(files ?? {}).length === 1 ?
						''
					:
						's'
				}
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
							resource={files}
							placeholderText="Loading source files…"
						>
							{#snippet children(files)}
								{#if Object.keys(files ?? {}).length > 0}
									<div data-column="gap-2">
										{#each Object.entries(files ?? {}) as [path, content] (path)}
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
</EntityView>
