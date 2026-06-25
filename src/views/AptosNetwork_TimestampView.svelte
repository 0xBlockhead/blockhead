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
			label: 'observed time/source',
		},
		'ledgerVersion',
		'blockHeight',
	],
	content: {
		dl: [
			[
				{
					label: 'observed time/source',
				},
				'ledgerVersion',
				'blockHeight',
				'chainId',
				'epoch',
				{
					label: 'oldest retained ledger/block versions',
				},
				'nodeRole',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'AptosNetwork',
					},
				],
			},
			{
				label: 'Ledger head',
				items: [
					'ledgerVersion',
					'blockHeight',
					'epoch',
				],
			},
			{
				label: 'Node retention',
				items: [
					{
						label: 'oldest retained ledger version',
					},
					{
						label: 'oldest retained block height',
					},
					'nodeRole',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'ledger info response headers',
					},
					{
						label: 'indexer metadata',
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
			selection: EntityProxyResource<typeof schema, EntityType.AptosNetwork_Timestamp>
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
	entityType={EntityType.AptosNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
