<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(contracts)/contract/[address]', {
				...{ caip2Namespace: entityId.$network.caip2.namespace, caip2Reference: entityId.$network.caip2.reference },
			address: entityId.address,
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
			entityId: EntityId<typeof schema, EntityType.EvmContractCompilation>
			href?: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

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
			<dl data-column-item="center">
				<div>
					<dt>Language</dt>
					<dd>
						<ResourceBoundary
							resource={compilation}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(compilation)}
								{#if compilation.language}
									{compilation.language}
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
								{#if compilation.compiler}
									{compilation.compiler}
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
								{#if compilation.compilerVersion}
									{compilation.compilerVersion}
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
								{#if compilation.fullyQualifiedName}
									<code>{compilation.fullyQualifiedName}</code>
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
								{#if compilation.compilerSettingsJson}
									<TruncatedValue
										value={compilation.compilerSettingsJson}
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
								{#if compilation.storageLayoutJson}
									<TruncatedValue
										value={compilation.storageLayoutJson}
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

	{#snippet Details({ open })}
	{/snippet}
</EntityView>
