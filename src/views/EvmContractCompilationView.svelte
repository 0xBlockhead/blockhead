<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		children: _children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
			|| layout === EntityLayout.Details
		),
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmContractCompilation>
			href: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	const compilation = useEntity(
		EntityType.EvmContractCompilation,
		entityId,
		{
			$: [
				Source.Sourcify_Rest,
			],
			...(open && {
				language: {},
				compiler: {},
				compilerVersion: {},
				name: {},
				fullyQualifiedName: {},
				compilerSettingsJson: {},
				storageLayoutJson: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractCompilation}
	{entityId}
	{href}
	{layout}
	{summaryUsesHeading}
	bind:open
	{collapsible}
	{...entityViewRest}
>
	{#snippet Title()}
		Compilation run
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={compilation}
			placeholderText="Loading compilation…"
		>
			{#snippet children(compilation)}
				{compilation.fullyQualifiedName
					?? compilation.name
					?? compilation.language
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
			<ResourceBoundary
				resource={compilation}
				placeholderText="Loading compilation metadata…"
			>
				{#snippet children(compilation)}
					<dl data-column-item="center">
						{#if compilation.language}
							<div>
								<dt>Language</dt>
								<dd>{compilation.language}</dd>
							</div>
						{/if}
						{#if compilation.compiler}
							<div>
								<dt>Compiler</dt>
								<dd>{compilation.compiler}</dd>
							</div>
						{/if}
						{#if compilation.compilerVersion}
							<div>
								<dt>Compiler version</dt>
								<dd>{compilation.compilerVersion}</dd>
							</div>
						{/if}
						{#if compilation.fullyQualifiedName}
							<div>
								<dt>Fully qualified name</dt>
								<dd><code>{compilation.fullyQualifiedName}</code></dd>
							</div>
						{/if}
						{#if compilation.compilerSettingsJson}
							<div>
								<dt>Compiler settings (JSON)</dt>
								<dd>
									<TruncatedValue
										value={compilation.compilerSettingsJson}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}
						{#if compilation.storageLayoutJson}
							<div>
								<dt>Storage layout (JSON)</dt>
								<dd>
									<TruncatedValue
										value={compilation.storageLayoutJson}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.EvmContractCompilation}
			{entityId}
		/>

		{#if _children}
			<section>
				{@render _children()}
			</section>
		{/if}
	{/snippet}
</EntityView>
