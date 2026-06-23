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
				label: 'native balance',
			},
			'sequence',
			{
				label: 'ledger sequence',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'native balance',
					},
					'sequence',
					{
						label: 'ledger sequence',
					},
					{
						label: 'subentry count',
					},
					{
						label: 'signer count',
					},
					'thresholds',
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
					label: 'Account',
					items: [
						{
							label: 'StellarAccount',
						},
					],
				},
				{
					label: 'Ledger state',
					items: [
						{
							label: 'native balance',
						},
						'sequence',
						{
							label: 'ledger sequence',
						},
					],
				},
				{
					label: 'Account config',
					items: [
						{
							label: 'subentry count',
						},
						{
							label: 'signer count',
						},
						'thresholds',
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Horizon/RPC/explorer account payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarAccount_Timestamp>
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
	entityType={EntityType.StellarAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
