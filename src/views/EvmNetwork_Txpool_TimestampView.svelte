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
			label: 'pending/queued counts',
		},
		{
			label: 'observation timestamp',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'pending/queued counts',
				},
				{
					label: 'observation timestamp',
				},
				'source',
				{
					label: 'unsupported-source empty state',
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
						label: 'parent EVM network',
					},
				],
			},
			{
				label: 'Txpool counts',
				items: [
					{
						label: 'pending',
					},
					{
						label: 'queued',
					},
					{
						label: 'unsupported-source empty state',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'txpool_status response',
					},
					{
						label: 'client-local endpoint context',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetwork_Txpool_Timestamp>
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
	entityType={EntityType.EvmNetwork_Txpool_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
