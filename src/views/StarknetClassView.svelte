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
		'classHash',
		{
			label: 'class version',
		},
		{
			label: 'declared block',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'classHash',
				{
					label: 'class version',
				},
				'sierraProgramHash',
				'casmClassHash',
			],
			[
				'abiHash',
				{
					label: 'declared block',
				},
				{
					label: 'declared transaction',
				},
				'$$contracts',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contracts',
				items: [
					{
						label: 'contracts using this class',
					},
				],
			},
			{
				label: 'Declaration',
				items: [
					{
						label: 'declare transaction',
					},
				],
			},
			{
				label: 'Class payload',
				items: [
					{
						label: 'ABI',
					},
					{
						label: 'Sierra/CASM hashes',
					},
					{
						label: 'raw contract class',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'starknet_getClass',
					},
					{
						label: 'starknet_getClassAt',
					},
					{
						label: 'declare transaction payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'contracts',
			label: 'contracts',
			field: '$$contracts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.StarknetClass>
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
	entityType={EntityType.StarknetClass}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
