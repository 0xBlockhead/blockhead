<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Contract compilations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmContractCompilation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmContractCompilation}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				fullyQualifiedName: true,
				compiler: true,
				compilerVersion: true,
				language: true,
				$contract: true,
			},
		})
	}
>
	{#snippet Item({ item: evmContractCompilation })}
		{@const evmContractCompilationSelector = evmContractCompilation[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmContractCompilation}
			entitySelector={evmContractCompilationSelector}
		>
			{#snippet Title()}
				{[(evmContractCompilation.name ?? ''), (evmContractCompilation.fullyQualifiedName ?? ''), (evmContractCompilation.compiler ?? '')].filter(Boolean).join(' ') || 'EVM contract compilation'}
			{/snippet}

			{#snippet Value()}
				{[(evmContractCompilation.compilerVersion ?? ''), (evmContractCompilation.language ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(evmContractCompilation.$contract.precompileName ?? ''), evmContractCompilationSelector.$contract.address].filter(Boolean).join(' ') || 'EVM contract'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
