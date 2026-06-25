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
		'txHash',
		'$block',
	],
	content: {
		dl: [
			[
				'$network',
				'txHash',
				'$block',
				'version',
				'unlockTime',
			],
			[
				'feeAtomicUnits',
				'$$keyImages',
				'$$stealthOutputs',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Key images',
				items: [
					{
						label: 'public key-image input rows',
					},
				],
			},
			{
				label: 'Stealth outputs',
				items: [
					{
						label: 'public stealth-output rows',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'containing Monero block',
					},
				],
			},
			{
				label: 'Local wallet interpretation',
				items: [
					{
						label: 'BlockheadMoneroTransferState when a connected wallet maps this transaction',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'key-images',
			label: 'key images',
			field: '$$keyImages',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'stealth-outputs',
			label: 'stealth outputs',
			field: '$$stealthOutputs',
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
			selection: EntityProxyResource<typeof schema, EntityType.MoneroTransaction>
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
	entityType={EntityType.MoneroTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
