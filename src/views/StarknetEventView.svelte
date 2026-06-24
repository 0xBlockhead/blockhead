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
			label: 'transaction',
		},
		{
			label: 'event index',
		},
		{
			label: 'from contract',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'transaction',
				},
				{
					label: 'event index',
				},
				{
					label: 'from contract',
				},
				{
					label: 'key count',
				},
				{
					label: 'data count',
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
						label: 'parent Starknet transaction',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'emitting Starknet contract',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					'keys',
					'data',
					{
						label: 'decoded event when ABI is available',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'transaction receipt events',
					},
					{
						label: 'indexer event payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetEvent>
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
	entityType={EntityType.StarknetEvent}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
