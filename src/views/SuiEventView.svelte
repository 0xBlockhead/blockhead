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
				label: 'event type',
			},
			{
				label: 'package/module',
			},
			'sender',
		],
		content: {
			dl: [
				[
					{
						label: 'event type',
					},
					{
						label: 'package/module',
					},
					'sender',
					{
						label: 'transaction digest',
					},
					{
						label: 'event index',
					},
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
						{
							label: 'package id',
						},
						{
							label: 'module name',
						},
						'sender',
					],
				},
				{
					label: 'Event payload',
					items: [
						{
							label: 'event type',
						},
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
