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
				label: 'ledger',
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
						label: 'ledger',
					},
					{
						label: 'observation time',
					},
					'source',
					'symbol',
					'name',
					'decimals',
					'fee',
					{
						label: 'archive count',
					},
					{
						label: 'supported standards',
					},
					{
						label: 'latest block index',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Ledger',
					items: [
						{
							label: 'parent ICP ledger canister',
						},
					],
				},
				{
					label: 'Archive canisters',
					items: [
						{
							label: 'archive canister refs',
						},
					],
				},
				{
					label: 'Methods',
					items: [
						{
							label: 'icrc1_metadata',
						},
						{
							label: 'icrc1_fee',
						},
						{
							label: 'icrc1_supported_standards',
						},
						{
							label: 'get_blocks/archive payload',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'ledger method',
						},
						{
							label: 'Rosetta',
						},
						{
							label: 'or dashboard payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpLedgerCanister_Timestamp>
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
	entityType={EntityType.IcpLedgerCanister_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
