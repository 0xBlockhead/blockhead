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
		'eventType',
		{
			label: 'package/module',
		},
		'sender',
	],
	content: {
		dl: [
			[
				'eventType',
				{
					label: 'package/module',
				},
				'sender',
				'transactionDigest',
				'eventIndex',
				{
					label: 'value payload',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'SuiTransaction',
					},
				],
			},
			{
				label: 'Emitter',
				items: [
					'packageId',
					'moduleName',
					'sender',
				],
			},
			{
				label: 'Event payload',
				items: [
					'eventType',
					{
						label: 'value JSON',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Sui transaction/event payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiEvent>
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
	entityType={EntityType.SuiEvent}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
