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
				label: 'network',
			},
			'direction',
			{
				label: 'peg transaction id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'direction',
					{
						label: 'peg transaction id',
					},
					{
						label: 'Bitcoin transaction',
					},
					{
						label: 'Elements transaction',
					},
					{
						label: 'amount',
					},
					{
						label: 'latest status',
					},
					{
						label: 'claim script',
					},
					{
						label: 'PAK proof',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Bitcoin side',
					items: [
						{
							label: 'Bitcoin-side UTXO transaction',
						},
					],
				},
				{
					label: 'Elements side',
					items: [
						{
							label: 'Elements-side UTXO transaction',
						},
					],
				},
				{
					label: 'Status observations',
					items: [
						{
							label: 'timestamped peg status observations',
						},
					],
				},
				{
					label: 'Proof',
					items: [
						{
							label: 'claim script',
						},
						{
							label: 'PAK proof evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.ElementsPeg>
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
	entityType={EntityType.ElementsPeg}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
