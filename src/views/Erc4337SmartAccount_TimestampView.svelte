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
			label: 'smart account',
		},
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'smart account',
				},
				'timestampMs',
				'source',
				{
					label: 'indexed user-operation count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Smart account',
				items: [
					{
						label: 'parent ERC-4337 smart account',
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
				label: 'Factory',
				items: [
					{
						label: 'linked factory when available',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Blockscout smart-account detail/list payload fields such as total_ops',
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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4337SmartAccount_Timestamp>
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
	entityType={EntityType.Erc4337SmartAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
