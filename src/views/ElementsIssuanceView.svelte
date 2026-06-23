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
				label: 'transaction input',
			},
			{
				label: 'asset',
			},
			{
				label: 'reissuance token asset',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transaction input',
					},
					{
						label: 'asset',
					},
					{
						label: 'reissuance token asset',
					},
					{
						label: 'issued amount',
					},
					{
						label: 'token amount',
					},
					{
						label: 'reissuance flag',
					},
					{
						label: 'entropy',
					},
					{
						label: 'blinding nonce',
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
							label: 'parent UTXO transaction',
						},
					],
				},
				{
					label: 'Asset',
					items: [
						{
							label: 'issued Elements asset',
						},
					],
				},
				{
					label: 'Reissuance token',
					items: [
						{
							label: 'reissuance token Elements asset',
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
			selection: EntityProxyResource<typeof schema, EntityType.ElementsIssuance>
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
	entityType={EntityType.ElementsIssuance}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
