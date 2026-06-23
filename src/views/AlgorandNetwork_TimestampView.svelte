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
				label: 'latest round',
			},
			{
				label: 'protocol version',
			},
			{
				label: 'genesis hash',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'latest round',
					},
					{
						label: 'protocol version',
					},
					{
						label: 'genesis hash',
					},
					'catchpoint',
					'source',
					{
						label: 'observation time',
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
							label: 'AlgorandNetwork',
						},
					],
				},
				{
					label: 'Node status',
					items: [
						{
							label: 'latest round',
						},
						'catchpoint',
						{
							label: 'protocol version',
						},
					],
				},
				{
					label: 'Genesis',
					items: [
						{
							label: 'genesis hash',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'algod/indexer status payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandNetwork_Timestamp>
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
	entityType={EntityType.AlgorandNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
