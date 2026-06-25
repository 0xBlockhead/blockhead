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
		'$network',
		'txId',
		'$block',
	],
	content: {
		dl: [
			[
				'$network',
				'txId',
				'$block',
				'version',
				'feeSats',
			],
			[
				{
					label: 'size/vsize/weight',
				},
				'lockTime',
				{
					label: 'coinbase flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Inputs',
				items: [
					{
						label: 'transaction inputs',
					},
				],
			},
			{
				label: 'Outputs',
				items: [
					{
						label: 'transaction outputs',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'containing block when confirmed',
					},
				],
			},
			{
				label: 'Shielded actions',
				items: [
					{
						label: 'Zcash shielded actions when present',
					},
				],
			},
			{
				label: 'Raw/source',
				items: [
					{
						label: 'source payload fields useful for debugging resolver conflicts',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'inputs',
			label: 'inputs',
			field: '$$inputs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'outputs',
			label: 'outputs',
			field: '$$outputs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'zcash-shielded-actions',
			label: 'zcash shielded actions',
			field: '$$zcashShieldedActions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.UtxoTransaction>
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
	entityType={EntityType.UtxoTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
