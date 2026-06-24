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
			label: 'transfer',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'transfer',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'status/substatus',
				},
				{
					label: 'confirmations',
				},
				{
					label: 'destination transaction hash',
				},
				'relayer',
				{
					label: 'refund transaction hash',
				},
				{
					label: 'estimated completion time',
				},
				{
					label: 'completed time',
				},
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transfer',
				items: [
					{
						label: 'parent bridge transfer',
					},
				],
			},
			{
				label: 'Destination evidence',
				items: [
					{
						label: 'mapped destination EVM transaction when available',
					},
				],
			},
			{
				label: 'Refund evidence',
				items: [
					{
						label: 'mapped refund transaction when available',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'status/indexer/log payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BridgeTransfer_Timestamp>
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
	entityType={EntityType.BridgeTransfer_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
