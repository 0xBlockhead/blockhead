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
			'hash',
			{
				label: 'source account',
			},
			{
				label: 'latest success/result code',
			},
		],
		content: {
			dl: [
				[
					'hash',
					{
						label: 'source account',
					},
					{
						label: 'latest ledger',
					},
					{
						label: 'latest success/result code',
					},
					{
						label: 'latest fee charged/max fee',
					},
					{
						label: 'latest memo',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest result',
					items: [
						{
							label: 'latest ledger/source transaction result observation',
						},
					],
				},
				{
					label: 'Result history',
					items: [
						{
							label: 'timestamped transaction result observations',
						},
					],
				},
				{
					label: 'Operations',
					items: [
						{
							label: 'operations in this transaction',
						},
					],
				},
				{
					label: 'XDR/result',
					items: [
						{
							label: 'envelope/result/meta inspectors from latest timestamp',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarTransaction>
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
	entityType={EntityType.StellarTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
