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
				label: 'linked Network',
			},
			{
				label: 'settlement UTXO network',
			},
			{
				label: 'federation name',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'linked Network',
					},
					{
						label: 'settlement UTXO network',
					},
					{
						label: 'federation name',
					},
					{
						label: 'block time',
					},
					{
						label: 'native asset',
					},
					{
						label: 'confidential-transactions default',
					},
					{
						label: 'asset count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Assets',
					items: [
						{
							label: 'Elements asset rows',
						},
					],
				},
				{
					label: 'Issuances',
					items: [
						{
							label: 'Elements issuance rows when scoped from transactions',
						},
					],
				},
				{
					label: 'Pegs',
					items: [
						{
							label: 'Elements peg rows when linked',
						},
					],
				},
				{
					label: 'Settlement',
					items: [
						{
							label: 'settlement UTXO network',
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
			selection: EntityProxyResource<typeof schema, EntityType.ElementsNetwork>
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
	entityType={EntityType.ElementsNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
