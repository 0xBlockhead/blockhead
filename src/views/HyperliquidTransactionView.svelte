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
		'$network',
		'txHash',
		'$block',
	],
	content: {
		dl: [
			[
				'$network',
				'txHash',
				'$block',
				'$account',
				'actionType',
				{
					label: 'latest status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped execution/status observations',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'containing HyperEVM block',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'linked Hyperliquid account when source context provides it',
					},
				],
			},
			{
				label: 'Raw execution payload',
				items: [
					{
						label: 'future decoded HyperEVM transaction fields when modeled',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidTransaction>
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
	entityType={EntityType.HyperliquidTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
