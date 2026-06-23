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
				label: 'contract id',
			},
			{
				label: 'latest executable observation',
			},
			{
				label: 'storage/transaction windows',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'contract id',
					},
					{
						label: 'latest wasm-hash/WASM observation',
					},
					{
						label: 'latest storage-entry count',
					},
					{
						label: 'transaction window count',
					},
					{
						label: 'network',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest executable',
					items: [
						{
							label: 'latest ledger/source executable observation',
						},
					],
				},
				{
					label: 'Executable history',
					items: [
						{
							label: 'ledger/source executable observations',
						},
					],
				},
				{
					label: 'Storage',
					items: [
						{
							label: 'contract storage entries',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'Stellar transactions touching this contract',
						},
					],
				},
				{
					label: 'Code',
					items: [
						{
							label: 'linked Soroban WASM code details',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Stellar network',
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
			selection: EntityProxyResource<typeof schema, EntityType.SorobanContract>
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
	entityType={EntityType.SorobanContract}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
