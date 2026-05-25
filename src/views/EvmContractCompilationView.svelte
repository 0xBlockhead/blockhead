<script lang="ts">
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
			'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]/compilation/[compilationId]',
			{
				networkId: String(entityId.$network.chainId),
				address: entityId.$contract.address,
				compilationId: entityId.compilationId,
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
			entityId: EntityId<typeof schema, EntityType.EvmContractCompilation>
			href?: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			open?: boolean
		},
		never
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
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		Compilation run
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={compilation}
			placeholderText="Loading compilation…"
		>
			{#snippet children(loadedCompilation)}
				{loadedCompilation.fullyQualifiedName
					?? loadedCompilation.name
					?? loadedCompilation.language
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
							{#snippet children(loadedCompilation)}
								{#if loadedCompilation.language}
									{loadedCompilation.language}
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
							{#snippet children(loadedCompilation)}
								{#if loadedCompilation.compiler}
									{loadedCompilation.compiler}
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
							{#snippet children(loadedCompilation)}
								{#if loadedCompilation.compilerVersion}
									{loadedCompilation.compilerVersion}
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
							{#snippet children(loadedCompilation)}
								{#if loadedCompilation.fullyQualifiedName}
									<code>{loadedCompilation.fullyQualifiedName}</code>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Compiler settings (JSON)</dt>
					<dd>
						<ResourceBoundary
							resource={compilation}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(loadedCompilation)}
								{#if loadedCompilation.compilerSettingsJson}
									<TruncatedValue
										value={loadedCompilation.compilerSettingsJson}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Storage layout (JSON)</dt>
					<dd>
						<ResourceBoundary
							resource={compilation}
							placeholderText="Loading compilation metadata…"
						>
							{#snippet children(loadedCompilation)}
								{#if loadedCompilation.storageLayoutJson}
									<TruncatedValue
										value={loadedCompilation.storageLayoutJson}
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

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.EvmContractCompilation}
			{entityId}
		/>
	{/snippet}
</EntityView>
