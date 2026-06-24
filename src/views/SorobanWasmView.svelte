<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		{
			label: 'network',
		},
		{
			label: 'wasm hash',
		},
		{
			label: 'latest bytecode availability',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'wasm hash',
				},
				{
					label: 'latest bytecode availability',
				},
				{
					label: 'latest interface version',
				},
				{
					label: 'latest spec-entry count',
				},
				{
					label: 'contract count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest code',
				items: [
					{
						label: 'latest ledger/source WASM-code observation',
					},
				],
			},
			{
				label: 'Code history',
				items: [
					{
						label: 'ledger/source WASM-code observations',
					},
				],
			},
			{
				label: 'Contracts',
				items: [
					{
						label: 'contracts using this WASM',
					},
				],
			},
			{
				label: 'Bytes',
				items: [
					{
						label: 'raw WASM bytes when fetched',
					},
				],
			},
			{
				label: 'Spec',
				items: [
					{
						label: 'contract spec entries',
					},
					{
						label: 'environment metadata',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'RPC/indexer payloads',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SorobanWasm>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.SorobanWasm}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
