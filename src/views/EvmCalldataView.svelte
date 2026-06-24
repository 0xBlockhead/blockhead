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
			label: 'raw hex',
		},
		{
			label: 'contract call data length in bytes',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'raw hex',
				},
				{
					label: 'contract call data length in bytes',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Bytes',
				items: [
					{
						label: 'raw call/input data',
					},
				],
			},
			{
				label: 'Usage',
				items: [
					{
						label: 'transaction input',
					},
					{
						label: 'trace input',
					},
					{
						label: 'locally composed call payload',
					},
				],
			},
			{
				label: 'Decode context',
				items: [
					{
						label: 'ABI/interface context required before argument interpretation',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmCalldata>
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
	entityType={EntityType.EvmCalldata}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
