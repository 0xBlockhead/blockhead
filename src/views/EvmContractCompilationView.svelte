<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(contracts)/contract/[address]', {
				...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference },
			address: selector.address,
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

	const compilation = subscribe(EntityType.EvmContractCompilation,
		selector,
		({ sources: [
				Source.Sourcify_Rest,
			], fields: { ...(open && ({ language: true, compiler: true, compilerVersion: true, name: true, fullyQualifiedName: true, compilerSettingsJson: true, storageLayoutJson: true })) } }),
	)


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
			resource={compilation}
			placeholderText="Loading compilation…"
		>
			{#snippet children(compilation)}
				{compilation.fields.fullyQualifiedName
					?? compilation.fields.name
					?? compilation.fields.language
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
							resource={compilation}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(compilation)}
								{#if compilation.fields.language}
									{compilation.fields.language}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Compiler</dt>
					<dd>
						<ResourceBoundary
							resource={compilation}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(compilation)}
								{#if compilation.fields.compiler}
									{compilation.fields.compiler}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Compiler version</dt>
					<dd>
						<ResourceBoundary
							resource={compilation}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(compilation)}
								{#if compilation.fields.compilerVersion}
									{compilation.fields.compilerVersion}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Fully qualified name</dt>
					<dd>
						<ResourceBoundary
							resource={compilation}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(compilation)}
								{#if compilation.fields.fullyQualifiedName}
									<code>{compilation.fields.fullyQualifiedName}</code>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Compiler settings</dt>
					<dd>
						<ResourceBoundary
							resource={compilation}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(compilation)}
								{#if compilation.fields.compilerSettingsJson}
									<TruncatedValue
										value={compilation.fields.compilerSettingsJson}
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
							resource={compilation}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(compilation)}
								{#if compilation.fields.storageLayoutJson}
									<TruncatedValue
										value={compilation.fields.storageLayoutJson}
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
