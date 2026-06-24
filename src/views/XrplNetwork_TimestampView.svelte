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
			label: 'validated ledger',
		},
		{
			label: 'complete ledger range',
		},
		{
			label: 'load factor',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'validated ledger',
				},
				{
					label: 'complete ledger range',
				},
				{
					label: 'load factor',
				},
				{
					label: 'peer count',
				},
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
						label: 'XrplNetwork',
					},
				],
			},
			{
				label: 'Ledger range',
				items: [
					{
						label: 'validated ledger',
					},
					{
						label: 'complete ledger range',
					},
				],
			},
			{
				label: 'Node health',
				items: [
					{
						label: 'load factor',
					},
					{
						label: 'peer count',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'rippled/clio/server info payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplNetwork_Timestamp>
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
	entityType={EntityType.XrplNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
