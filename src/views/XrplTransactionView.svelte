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
				label: 'transaction type',
			},
			'account',
		],
		content: {
			dl: [
				[
					'hash',
					{
						label: 'transaction type',
					},
					'account',
					'sequence',
					{
						label: 'latest ledger index',
					},
					{
						label: 'latest fee drops',
					},
					{
						label: 'latest result/status',
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
							label: 'latest execution result by ledger/source',
						},
					],
				},
				{
					label: 'Result history',
					items: [
						{
							label: 'ledger/source result observations',
						},
					],
				},
				{
					label: 'Affected ledger entries',
					items: [
						{
							label: 'ledger entries from metadata AffectedNodes',
						},
					],
				},
				{
					label: 'Metadata',
					items: [
						{
							label: 'raw metadata/result inspector from latest timestamp',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplTransaction>
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
	entityType={EntityType.XrplTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
