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
				label: 'trace',
			},
			{
				label: 'observation time/source',
			},
			'status',
		],
		content: {
			dl: [
				[
					{
						label: 'trace',
					},
					{
						label: 'observation time/source',
					},
					'status',
					{
						label: 'transaction count',
					},
					{
						label: 'message count',
					},
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Trace',
					items: [
						{
							label: 'parent trace identity',
						},
					],
				},
				{
					label: 'Transaction DAG',
					items: [
						{
							label: 'transactions through trace',
						},
					],
				},
				{
					label: 'Message edges',
					items: [
						{
							label: 'messages through trace',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'trace payload freshness',
						},
						{
							label: 'indexer graph status',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonTrace_Timestamp>
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
	entityType={EntityType.TonTrace_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
