<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		selection,
		title = 'Precompiles',
		typeAnnotationParagraphs = ['Catalog precompiles active at the chain head according to the execution upgrade schedule.'],
		emptyText = undefined,
		href,
		open = $bindable(true),
		collapsible = true,
		id = 'EvmPrecompiles-list',
		...EvmContractsViewProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmContract>
			title?: string
			typeAnnotationParagraphs?: string[]
			emptyText?: string
			href?: string
			open?: boolean
			collapsible?: boolean
			id?: string
		},
		ComponentProps<typeof EvmContractsView>
	> = $props()


	// Components
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<EvmContractsView
	{...EvmContractsViewProps}
	{selection}
	{title}
	{typeAnnotationParagraphs}
	{emptyText}
	{href}
	bind:open
	{collapsible}
	{id}
/>
