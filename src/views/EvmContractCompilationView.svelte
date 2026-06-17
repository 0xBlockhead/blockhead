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
			selector: EntitySelector<typeof schema, EntityType.EvmContractCompilation>
			href?: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const compilation = $derived(proxy(EntityType.EvmContractCompilation, selector, {
		sources: [Source.Sourcify_Rest],
	}))
	const language = $derived(compilation.language)
	
	
	
	const fullyQualifiedName = $derived(compilation.fullyQualifiedName)
	
	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractCompilation}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={fullyQualifiedName}
			placeholderText="Loading compilation…"
		>
			{#snippet children(fullyQualifiedName)}
				{fullyQualifiedName
					?? (compilation.name).current
					?? language.current
					?? 'Compilation'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			One compiler invocation that produced bytecode matching on-chain creation or runtime code.
		</p>
		<p>
			Language, compiler id/version, and settings come from the verification record—not from execution-layer receipts.
		</p>
	{/snippet}

	{#snippet Content({
		open: contentOpen,
	})}
		{#if contentOpen}
			<dl data-column-item="center">
				<div>
					<dt>Language</dt>
					<dd>
						<ResourceBoundary
							resource={language}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(language)}
								{#if language}
									{language}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Compiler</dt>
					<dd>
						<ResourceBoundary
							resource={compilation.compiler}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(compiler)}
								{#if compiler}
									{compiler}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Compiler version</dt>
					<dd>
						<ResourceBoundary
							resource={compilation.compilerVersion}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(compilerVersion)}
								{#if compilerVersion}
									{compilerVersion}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Fully qualified name</dt>
					<dd>
						<ResourceBoundary
							resource={fullyQualifiedName}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(fullyQualifiedName)}
								{#if fullyQualifiedName}
									<code>{fullyQualifiedName}</code>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Compiler settings</dt>
					<dd>
						<ResourceBoundary
							resource={compilation.compilerSettingsJson}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(compilerSettingsJson)}
								{#if compilerSettingsJson}
									<TruncatedValue
										value={compilerSettingsJson}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Storage layout</dt>
					<dd>
						<ResourceBoundary
							resource={compilation.storageLayoutJson}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(storageLayoutJson)}
								{#if storageLayoutJson}
									<TruncatedValue
										value={storageLayoutJson}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			</dl>
		{/if}
	{/snippet}
</EntityView>
