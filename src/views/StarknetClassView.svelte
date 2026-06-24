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
			label: 'class hash',
		},
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
				{
					label: 'network',
				},
				{
					label: 'class hash',
				},
				{
					label: 'class version',
				},
				{
					label: 'Sierra program hash',
				},
				{
					label: 'CASM class hash',
				},
				{
					label: 'ABI hash',
				},
				{
					label: 'declared block',
				},
				{
					label: 'declared transaction',
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
