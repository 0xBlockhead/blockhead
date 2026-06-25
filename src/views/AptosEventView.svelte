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
		'transactionVersion',
		'eventIndex',
	],
	content: {
		dl: [
			[
				'eventType',
				'transactionVersion',
				'eventIndex',
				{
					label: 'account/creation/sequence coordinates',
				},
				'$transaction',
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
					'$transaction',
				],
			},
			{
				label: 'Emitter',
				items: [
					{
						label: 'emitting account when account address resolves',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'event JSON',
					},
					{
						label: 'type tag evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.AptosEvent>
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
	entityType={EntityType.AptosEvent}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
