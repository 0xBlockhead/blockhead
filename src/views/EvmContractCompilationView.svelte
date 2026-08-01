<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmContractCompilation> = $props()

	const evmContractCompilation = $derived(selection({
		fields: {
			name: true,
			fullyQualifiedName: true,
			compiler: true,
			compilerVersion: true,
			language: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), (prefetched.fullyQualifiedName ?? ''), (prefetched.compiler ?? '')].filter(Boolean).join(' ') || 'EVM contract compilation')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractCompilation}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmContractCompilation}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), (entity.fullyQualifiedName ?? ''), (entity.compiler ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmContractCompilation}>
			{#snippet children(entity)}
				{[(entity.compilerVersion ?? ''), (entity.language ?? '')].filter(Boolean).join(' ') || [(entity.name ?? ''), (entity.fullyQualifiedName ?? ''), (entity.compiler ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EvmContractView
				selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={evmContractCompilation}
			>
				{#snippet children(entity)}
					{@const language = entity.language}
					{#if language != null}
						<div>
							<dt>Language</dt>
							<dd>
								{language}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={evmContractCompilation}
			>
				{#snippet children(entity)}
					{@const compiler = entity.compiler}
					{#if compiler != null}
						<div>
							<dt>Compiler</dt>
							<dd>
								{compiler}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={evmContractCompilation}
			>
				{#snippet children(entity)}
					{@const compilerVersion = entity.compilerVersion}
					{#if compilerVersion != null}
						<div>
							<dt>Compiler version</dt>
							<dd>
								{compilerVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={evmContractCompilation}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={evmContractCompilation}
			>
				{#snippet children(entity)}
					{@const fullyQualifiedName = entity.fullyQualifiedName}
					{#if fullyQualifiedName != null}
						<div>
							<dt>Fully qualified name</dt>
							<dd>
								{fullyQualifiedName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
			resource={
				selection({
					fields: {
						compilerSettingsJson: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const compilerSettingsJson = entity.compilerSettingsJson}
				{#if compilerSettingsJson != null && compilerSettingsJson !== ''}
					<code>{compilerSettingsJson}</code>
				{:else}
					<p data-text="muted">No compiler settings JSON available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
