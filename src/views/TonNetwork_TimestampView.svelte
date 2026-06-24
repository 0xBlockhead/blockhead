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
			label: 'observed time',
		},
		'source',
		{
			label: 'masterchain seqno',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'observed time',
				},
				'source',
				{
					label: 'masterchain seqno',
				},
				{
					label: 'shard count',
				},
				{
					label: 'validator count',
				},
				{
					label: 'latest block time',
				},
				{
					label: 'indexer lag',
				},
				'health',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'parent TON network identity',
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
						label: 'raw status payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonNetwork_Timestamp>
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
	entityType={EntityType.TonNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
