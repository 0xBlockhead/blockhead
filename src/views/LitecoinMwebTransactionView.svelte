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
				label: 'MWEB block',
			},
			{
				label: 'transaction index',
			},
			{
				label: 'kernel offset',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'MWEB block',
					},
					{
						label: 'transaction index',
					},
					{
						label: 'kernel offset',
					},
					{
						label: 'output count',
					},
					{
						label: 'peg-in count',
					},
					{
						label: 'peg-out count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Outputs',
					items: [
						{
							label: 'MWEB public output rows',
						},
					],
				},
				{
					label: 'Peg-ins',
					items: [
						{
							label: 'MWEB peg-in rows',
						},
					],
				},
				{
					label: 'Peg-outs',
					items: [
						{
							label: 'MWEB peg-out rows',
						},
					],
				},
				{
					label: 'Block',
					items: [
						{
							label: 'parent MWEB block',
						},
					],
				},
				{
					label: 'Wallet matches',
					items: [
						{
							label: 'BlockheadLitecoinMwebOutputState rows for locally recognized outputs',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Litecoin Core MWEB transaction payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.LitecoinMwebTransaction>
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
	entityType={EntityType.LitecoinMwebTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
