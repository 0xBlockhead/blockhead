<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		id = 'SorobanWasmModules-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SorobanWasm> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SorobanWasm}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: sorobanWasm })}
		{@const sorobanWasmSelector = sorobanWasm[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SorobanWasm}
			entitySelector={sorobanWasmSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/wasm/[wasmHash=stringSegment]',
					{
						network: (
							sorobanWasmSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(sorobanWasmSelector.$network.$network.caip2)
							:
								sorobanWasmSelector.$network.$network.slug
						),
						wasmHash: sorobanWasmSelector.wasmHash,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
