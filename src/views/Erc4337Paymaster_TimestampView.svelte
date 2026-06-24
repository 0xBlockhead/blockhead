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
			label: 'paymaster',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'paymaster',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'indexed sponsored user-operation count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Paymaster',
				items: [
					{
						label: 'parent ERC-4337 paymaster',
					},
				],
			},
			{
				label: 'User operations',
				items: [
					{
						label: 'user operations for the same source scope',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Blockscout paymaster detail/list payload fields such as total_ops',
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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4337Paymaster_Timestamp>
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
	entityType={EntityType.Erc4337Paymaster_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
