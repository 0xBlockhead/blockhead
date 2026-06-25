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
		'$factory',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$factory',
				'timestampMs',
				'source',
				{
					label: 'indexed user-operation count',
				},
				{
					label: 'indexed smart-account count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Factory',
				items: [
					{
						label: 'parent ERC-4337 account factory',
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
				label: 'Smart accounts',
				items: [
					{
						label: 'smart-account links when source-returned',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Blockscout factory detail/list payload fields such as total_ops',
					},
					{
						label: 'total_accounts',
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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4337AccountFactory_Timestamp>
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
	entityType={EntityType.Erc4337AccountFactory_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
