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
				label: 'ledger index/hash',
			},
			{
				label: 'validation state',
			},
			{
				label: 'close time',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'ledger index',
					},
					{
						label: 'ledger hash',
					},
					{
						label: 'validation state',
					},
					{
						label: 'close time',
					},
					{
						label: 'parent hash',
					},
					{
						label: 'total XRP drops',
					},
					{
						label: 'account hash',
					},
					{
						label: 'transaction hash',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transactions',
					items: [
						{
							label: 'transactions in ledger',
						},
					],
				},
				{
					label: 'Ledger entries',
					items: [
						{
							label: 'ledger object entries',
						},
					],
				},
				{
					label: 'Lookup evidence',
					items: [
						{
							label: 'rippled ledger lookup by index/hash',
						},
						{
							label: 'Clio/XRPScan ledger payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplLedger>
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
	entityType={EntityType.XrplLedger}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
