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
			label: 'wasm',
		},
		{
			label: 'ledger sequence',
		},
		{
			label: 'bytecode availability',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'wasm',
				},
				{
					label: 'ledger sequence',
				},
				'source',
				{
					label: 'observed time',
				},
				{
					label: 'found state',
				},
			],
			[
				{
					label: 'byte length',
				},
				{
					label: 'interface version',
				},
				{
					label: 'spec-entry count',
				},
				{
					label: 'environment metadata availability',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'WASM',
				items: [
					{
						label: 'parent Soroban WASM',
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
						label: 'raw WASM bytes',
					},
				],
			},
			{
				label: 'Spec',
				items: [
					{
						label: 'decoded spec entries',
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
						label: 'ContractCode ledger entry',
					},
					{
						label: 'getLedgerEntries payload',
					},
					{
						label: 'decoder/parser version when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.SorobanWasm_Timestamp>
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
	entityType={EntityType.SorobanWasm_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
