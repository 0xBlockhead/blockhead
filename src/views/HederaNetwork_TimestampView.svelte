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
			label: 'observed time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'observed time',
				},
				'source',
				{
					label: 'latest consensus timestamp',
				},
				{
					label: 'latest block number',
				},
				{
					label: 'latest transaction count',
				},
				{
					label: 'aggregate counts',
				},
				{
					label: 'mirror-node lag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'parent Hedera network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'freshness',
					},
					{
						label: 'status payload',
					},
					{
						label: 'mirror-node base URL',
					},
					{
						label: 'pagination/rate-limit context',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetwork_Timestamp>
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
	entityType={EntityType.HederaNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
